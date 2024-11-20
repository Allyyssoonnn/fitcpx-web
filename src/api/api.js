import axios from "axios";
import { parseCookies, setCookie } from 'nookies';
const PRODUCAO = true;

const api = axios.create({
    baseURL: PRODUCAO ? 'https://api.alyson.site/' : 'http://localhost:8070',
});

api.interceptors.response.use((response) => response, async (error) => {
    const cookies = parseCookies();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshResponse = await axios.post('/usuario/refreshToken', {
            refreshToken: cookies.refreshToken,
        });

        if (refreshResponse.data.status) {
            setCookie(null, 'token', refreshResponse.data.token, { maxAge: 60 * 15 });
            originalRequest.headers['Authorization'] = refreshResponse.data.token;
            return api(originalRequest);
        }
    }

    return Promise.reject(error);
});

async function post(url, data) {
    const cookies = parseCookies(null);
    const resp = await api({
        headers: { Authorization: cookies.token, "Access-Control-Allow-Origin": '*' },
        method: 'POST',
        url,
        data
    });

    return resp.data;
}

async function get(url) {
    const cookies = parseCookies(null);
    const resp = await api({
        headers: { Authorization: cookies.token },
        method: 'GET',
        url
    });

    return resp.data;
}

export {
    api,
    post,
    get,
};