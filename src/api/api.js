import axios from "axios";
import { destroyCookie, parseCookies, setCookie } from 'nookies';
const PRODUCAO = false;

const baseURL = PRODUCAO ? 'https://api.fitcpx.com' : 'http://192.168.1.2:8070';

const api = axios.create({
    baseURL: baseURL,
});

api.interceptors.response.use((response) => response, async (error) => {
    const cookies = parseCookies();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            var user;
            if (import.meta.env.VITE_BUILD_TYPE == 'aluno') user = 'appaluno';
            if (import.meta.env.VITE_BUILD_TYPE == 'admin') user = 'appadmin';
            if (import.meta.env.VITE_BUILD_TYPE == 'usuario') user = 'usuario';
            const refreshResponse = await axios.post(baseURL + `/${user}/refreshToken`, {
                refreshToken: cookies.refreshToken,
            });
            
            if (refreshResponse.data.status) {
                setCookie(null, 'token', refreshResponse.data.token, { maxAge: 60 * 15 });
                originalRequest.headers['Authorization'] = refreshResponse.data.token;
                return api(originalRequest);
            }
        } catch (e) {
            destroyCookie(null, 'token');
            window.location.replace('/entrar');
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

async function postImage(url, img, data) {
    const cookies = parseCookies(null);
    const resp = await api.post(url, img, {
        headers: {
            Authorization: cookies.token, "Access-Control-Allow-Origin": '*',
            ...data
        },
    });

    return resp.data;
}

export {
    api,
    post,
    get,
    postImage,
};