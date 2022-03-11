import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInterceptorManager,
  AxiosError,
} from 'axios';
import _get from 'lodash/get';
import errorCode from '@/data/errorCode';
import cookieService from '@/services/CookieService';
import { ToastOption } from '@/hooks/useToast';
import CookieService from '@/services/CookieService';

type CustomResponseFormat<T = any> = {
  response: T;
  // refreshedToken?: string;
};
interface CustomInstance extends AxiosInstance {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse<CustomResponseFormat>>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T>(config: AxiosRequestConfig): Promise<T>;
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}
interface ApiResponse {
  data: {
    query: {
      [key: string]: unknown;
    };
    errorCode?: string;
    msg: string;
    state: number;
  };
}

interface ApiContructorParams {
  toast: (msg: string, options?: ToastOption) => void,
  cookie: CookieService,
  setLoadStatus: (status: boolean) => void
}

export default class ApiConnection {
  #axios: CustomInstance;
  #baseURL: string = import.meta.env.VITE_API_URL || '';
  #toast;
  #cookie;
  #setLoadStatus;

  constructor({toast, cookie, setLoadStatus}: ApiContructorParams) {
    this.#axios = axios.create({ baseURL: this.#baseURL });
    this.#toast = toast;
    this.#cookie = cookie;
    this.#setLoadStatus = setLoadStatus;

    this.#axios.interceptors.request.use(function (config) {
      const accessToken = cookie.getAccessToken();
      if (config.headers) {
        config.headers['Content-Type'] = 'application/json';
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });
  }

  #responseHandler = (promise: Promise<ApiResponse>, {silent = false, image = false} : {silent?: boolean, image?:boolean}) =>{
    this.#setLoadStatus(true);
    silent = Boolean(silent);
    image = Boolean(image);

    return new Promise((resolve, reject) => {
      promise
        .then((response) => {
          if(image) resolve(response);
          else resolve(response.data.query || response.data);
        })
        .catch((e: Error | AxiosError) => {
          const data = _get(e, 'response.data');
          const code: string = _get(e, 'response.data.errorCode');
          const msg: string = _get(e, 'response.data.msg', '');

          this.#toast(errorCode[code] || msg || errorCode['DEFAULT']);

          reject({ error: data, code });
        }).finally(() => {
          this.#setLoadStatus(false);
        });
    });
  }

  getFile(url: string,config?: AxiosRequestConfig & { silent?: boolean, image?: boolean }) : Promise<any> {
    return this.#responseHandler(this.#axios({method: 'get', url, responseType: 'blob'}), {silent: config?.silent, image: true});
  }

  get(
    path: string,
    params?: object,
    config?: AxiosRequestConfig & { silent?: boolean, image?: boolean }
  ): Promise<any> {
    return this.#responseHandler(this.#axios.get(path, { ...config, params }), {silent: config?.silent, image: config?.image});
  }

  post(
    path: string,
    data?: object,
    config?: AxiosRequestConfig & { silent?: boolean, image?: boolean }
  ): Promise<any> {
    return this.#responseHandler(this.#axios.post(path, data, config), {silent: config?.silent, image: config?.image});
  }

  put(
    path: string,
    data?: object,
    config?: AxiosRequestConfig & { silent?: boolean, image?: boolean }
  ): Promise<any> {
    return this.#responseHandler(this.#axios.put(path, data, config), {silent: config?.silent, image: config?.image});
  }

  delete(
    path: string,
    data?: object,
    config?: AxiosRequestConfig & { silent?: boolean, image?: boolean }
  ): Promise<any> {
    return this.#responseHandler(this.#axios.delete(path, { ...config, data }), {silent: config?.silent, image: config?.image});
  }
}
