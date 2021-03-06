import axios from "axios";
import environment from "../environment";

const TOKEN = "token";

export default class AuthService {
  constructor() {
    this.token = localStorage.getItem(TOKEN);
    this.isAuthenticated = this.token !== null;
    this.subscribers = new Set();
    this.requestInterceptor = null;
    this.responseInterceptor = null;

    if (this.isAuthenticated) {
      this.addInterceptors();
      this.testAuthentication();
    }
  }

  async login(authRequest) {
    try {
      let res = await axios.post(
        environment.basePath + "/accounts/login",
        authRequest
      );
      this.token = res.data.jwt;
      localStorage.setItem(TOKEN, this.token);
      this.isAuthenticated = true;
      this.sendEvent(true);
      this.removeInterceptors(); //just in case
      this.addInterceptors();
      return this.token;
    } catch (err) {
      return err.response.status;
    }
  }

  sendEvent(authenticationStatus) {
    for (const fn of this.subscribers) {
      fn.call(fn, authenticationStatus);
    }
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem(TOKEN);
    this.token = null;
    this.removeInterceptors();
    this.sendEvent(this.isAuthenticated);
  }

  /**
   * You need to unsubscribe from this!
   * Don't throw errors in the callback
   * @param {Function(boolean):void} callback
   * @returns {Function():void} unsubscribe
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.isAuthenticated);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  addInterceptors() {
    this.requestInterceptor = axios.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${this.token}`;
      return config;
    });

    this.responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return Promise.resolve(response);
      },
      (error) => {
        if (error.response.status === 401) {
          if (this.isAuthenticated) this.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  removeInterceptors() {
    axios.interceptors.request.eject(this.requestInterceptor);
    axios.interceptors.response.eject(this.responseInterceptor);
  }

  testAuthentication() {
    return axios.get(environment.basePath + "/accounts/authenticated");
  }
}

export function register(body) {
  return axios.put(
    environment.basePath + "/accounts/register?admin=true",
    body
  );
}

export function activate(token) {
  return axios.post(environment.basePath + `/accounts/activate/${token}`, {});
}

export function requestResetPassword(email) {
  return axios.get(
    environment.basePath + `/accounts/reset-password/admin/${email}`
  );
}

export function updatePassword(token, password) {
  return axios.post(environment.basePath + "/accounts/reset-password", {
    newPassword: password,
    token,
  });
}
