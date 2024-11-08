import { request } from '../request';

export function passwordOathCodeApi(input: Api.Auth.PasswordOathCodeRequest) {
  return request<Api.Auth.OathCodeResponse>({
    url: '/auth/login',
    method: 'post',
    data: {
      account: input.account,
      password: input.password
    }
  });
}

export function oathCodeCodeApi(input: Api.Auth.OathCodeLoginRequest) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data: {
      account: input.account,
      oathCode: input.oathCode
    }
  });
}

export function fetchLogin(userName: string, password: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/login',
    method: 'post',
    data: {
      userName,
      password
    }
  });
}

export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: '/auth/getUserInfo' });
}

export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
