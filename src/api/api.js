import axios from "axios";
import { destroyCookie, parseCookies, setCookie } from 'nookies';
export const PRODUCAO = false;

export const baseURL = PRODUCAO ? 'https://api.fitcpx.com' : 'http://localhost:8070';

const api = axios.create({
    baseURL: baseURL,
});

api.interceptors.response.use((response) => response, async (error) => {
    const cookies = parseCookies();
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshResponse = await axios.post(baseURL + `/usuario/refreshToken`, {
                refreshToken: cookies.refreshToken,
            });
            
            if (refreshResponse.data.status) {
                setCookie(null, 'token', refreshResponse.data.token, { maxAge: 60 * 15 });
                originalRequest.headers['Authorization'] = refreshResponse.data.token;
                return api(originalRequest);
            }
        } catch (e) {
            destroyCookie(null, 'token');
            localStorage.removeItem('recoil-persist');
            window.location.replace('/entrar');
        }
    }

    return Promise.reject(error);
});

async function postFile(url, data, fileBlob, fileName = 'arquivo.pdf') {
    const cookies = parseCookies(null);
    const formData = new FormData();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    formData.append('contratoPDF', fileBlob, fileName);
    
    try {
        const resp = await api({
            headers: {
                Authorization: cookies.token,
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'multipart/form-data', // Importante para enviar arquivos
            },
            method: 'POST',
            url,
            data: formData,
        });
        return resp.data;
    } catch (error) {
        console.log(error);
    }
}

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
    postFile,
    get,
    postImage,
};