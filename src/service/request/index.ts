import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
    }
  },
  {
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization, 'X-Request': Number(new Date()) });

      return config;
    },
    isBackendSuccess(response) {
      // 当后端响应码为 0（默认）时，表示请求成功
      // 如果你自己想改这个逻辑，可以修改 `.env` 文件中的 `VITE_SERVICE_SUCCESS_CODE`
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    async onBackendFail(response, instance) {
      const authStore = useAuthStore();
      const responseCode = String(response.data.code);

      function handleLogout() {
        authStore.resetStore();
      }

      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);

        request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.msg);
      }

      // 当后端响应代码在“logoutCodes”中时，表示用户将被注销并重定向到登录页面
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        return null;
      }

      // 当后端响应代码为“modalLogoutCodes”时，表示用户将通过显示模态框的方式注销
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !request.state.errMsgStack?.includes(responseCode)) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.msg];

        // 阻止用户刷新页面
        window.addEventListener('beforeunload', handleLogout);

        window.$modal?.error({
          title: $t('common.error'),
          content: response.data.msg,
          okText: $t('common.confirm'),
          maskClosable: false,
          onOk() {
            logoutAndCleanup();
          },
          onCancel() {
            logoutAndCleanup();
          }
        });

        return null;
      }

      // 当后端响应码在 `expiredTokenCodes` 中时，表示 token 已过期，刷新 token
      // api`refreshToken`不能在`expiredTokenCodes`中返回错误码，否则会死循环，应该返回`logoutCodes`或`modalLogoutCodes`
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(responseCode)) {
        const success = await handleExpiredRequest(request.state);
        if (success) {
          const Authorization = getAuthorization();
          Object.assign(response.config.headers, { Authorization });

          return instance.request(response.config) as Promise<AxiosResponse>;
        }
      }

      return null;
    },
    transformBackendResponse(response) {
      return response.data.data;
    },
    onError(error) {
      // 当请求失败时，可以显示错误消息
      let message = error.message;
      let backendErrorCode = '';

      // 获取后端错误信息及代码
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code) || '';
      }

      // 错误消息显示在模式中
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      // 当令牌过期时，刷新令牌并重试请求，因此无需显示错误消息
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      showErrorMsg(request.state, message);
    }
  }
);

export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo
  },
  {
    async onRequest(config) {
      const { headers } = config;

      // set token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // 当后端响应码为 “200” 时，表示请求成功
      // 你可以自己改变这个逻辑
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // 当后端响应码不为“200”时，表示请求失败
      // 例如：token过期，刷新token并重试请求
    },
    transformBackendResponse(response) {
      return response.data.result;
    },
    onError(error) {
      // 当请求失败时，可以显示错误消息

      let message = error.message;

      // 显示后端错误信息
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
