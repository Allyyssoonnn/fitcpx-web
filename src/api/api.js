import axios from "axios";
import { parseCookies } from 'nookies';
const PRODUCAO = false;

const api = axios.create({
    baseURL: PRODUCAO ? 'https://fiscal.apefoods.com.br/api' : 'http://localhost:8070',
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