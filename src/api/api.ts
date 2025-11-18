import axios, { AxiosResponse } from "axios";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { toast } from "sonner";

export const PRODUCAO = import.meta.env.MODE === "production";
// export const baseURL = PRODUCAO ? "https://api.fitcpx.com" : "http://localhost:8070";

export const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
   baseURL,
});

// Interceptor para lidar com 401 e 403
api.interceptors.response.use(
   (response: AxiosResponse) => response,
   async (error: any) => {
      const cookies = parseCookies();
      const originalRequest = error.config;

      if (error.response?.data?.message) {
         toast.error(error.response.data.message);
      }

      if (error.response?.status === 403) {
         const msg = error.response.data?.message || "Você não tem permissão para acessar este recurso.";
         toast.error(msg);
      }

      if (error.response?.status === 401 && !originalRequest._retry && !(originalRequest?.url == "/users/login")) {
         originalRequest._retry = true;

         try {
            const refreshResponse = await axios.post(`${baseURL}/users/refreshToken`, {
               refreshToken: cookies.refreshToken,
            });

            if (refreshResponse.data.token) {
               setCookie(null, "token", refreshResponse.data.token, {
                  maxAge: 60 * 15,
               });
               setCookie(null, "refreshToken", refreshResponse.data.refreshToken, { maxAge: 60 * 60 * 24 * 7 });
               setCookie(null, "licenseStatus", refreshResponse.data.license.status, { maxAge: 60 * 60 * 24 * 7 });
               setCookie(null, "licenseTrialDaysLeft", refreshResponse.data.license.trialDaysLeft, {
                  maxAge: 60 * 60 * 24 * 7,
               });
               originalRequest.headers["Authorization"] = refreshResponse.data.token;
               return api(originalRequest);
            }
         } catch (e) {
            destroyCookie(null, "token");
            localStorage.removeItem("recoil-persist");
            window.location.replace("/entrar");
         }
      }

      return Promise.reject(error);
   }
);

// Tipagem para dados genéricos
type DataObject = Record<string, any>;

// POST com arquivo
async function postFile<T = any>(
   url: string,
   data: DataObject,
   fileBlob: Blob,
   fileName: string = "arquivo.pdf"
): Promise<T | undefined> {
   const cookies = parseCookies(null);
   const formData = new FormData();

   for (const key in data) {
      formData.append(key, data[key]);
   }

   formData.append("contratoPDF", fileBlob, fileName);

   try {
      const resp = await api.post<T>(url, formData, {
         headers: {
            Authorization: cookies.token,
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "multipart/form-data",
         },
      });
      return resp.data;
   } catch (error) {
      console.error(error);
      return undefined;
   }
}

// POST genérico
async function post<T = any>(url: string, data: DataObject): Promise<T> {
   const cookies = parseCookies(null);
   const resp = await api.post<T>(url, data, {
      headers: {
         Authorization: cookies.token,
         "Access-Control-Allow-Origin": "*",
      },
   });
   return resp.data;
}

// GET genérico
async function get<T = any>(url: string): Promise<T> {
   const cookies = parseCookies(null);
   const resp = await api.get<T>(url, {
      headers: { Authorization: cookies.token },
   });
   return resp.data;
}

// DELETE genérico
async function deleteAPI<T = any>(url: string): Promise<T> {
   const cookies = parseCookies(null);
   const resp = await api.delete<T>(url, {
      headers: { Authorization: cookies.token },
   });
   return resp.data;
}

// POST de imagem com headers adicionais
async function postImage<T = any>(url: string, img: Blob | File, data?: Record<string, string>): Promise<T> {
   const cookies = parseCookies(null);
   const resp = await api.post<T>(url, img, {
      headers: {
         Authorization: cookies.token,
         "Access-Control-Allow-Origin": "*",
         ...data,
      },
   });
   return resp.data;
}

export { api, deleteAPI, get, post, postFile, postImage };
