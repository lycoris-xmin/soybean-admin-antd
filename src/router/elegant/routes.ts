// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { ElegantRoute } from '@elegant-router/types';

export const autoRoutes: ElegantRoute[] = [
  {
    path: '/403',
    component: 'layout.base',
    children: [
      {
        name: '403',
        path: '',
        component: 'view.403',
        meta: {
          title: '403'
        }
      }
    ]
  },
  {
    path: '/404',
    component: 'layout.base',
    children: [
      {
        name: '404',
        path: '',
        component: 'view.404',
        meta: {
          title: '404'
        }
      }
    ]
  },
  {
    path: '/500',
    component: 'layout.base',
    children: [
      {
        name: '500',
        path: '',
        component: 'view.500',
        meta: {
          title: '500'
        }
      }
    ]
  },
  {
    path: '/home',
    component: 'layout.base',
    children: [
      {
        name: 'home',
        path: '',
        component: 'view.home',
        meta: {
          title: 'home',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
    component: 'layout.blank',
    children: [
      {
        name: 'login',
        path: '',
        component: 'view.login',
        meta: {
          title: 'login'
        }
      }
    ]
  },
  {
    name: 'multi-menu',
    path: '/multi-menu',
    component: 'layout.base',
    redirect: {
      name: 'multi-menu_first'
    },
    meta: {
      title: 'multi-menu',
      requiresAuth: true
    },
    children: [
      {
        name: 'multi-menu_first',
        path: '/multi-menu/first',
        redirect: {
          name: 'multi-menu_first_child'
        },
        meta: {
          title: 'multi-menu_first'
        }
      },
      {
        name: 'multi-menu_first_child',
        path: '/multi-menu/first/child',
        component: 'view.multi-menu_first_child',
        meta: {
          title: 'multi-menu_first_child'
        }
      },
      {
        name: 'multi-menu_second',
        path: '/multi-menu/second',
        redirect: {
          name: 'multi-menu_second_child'
        },
        meta: {
          title: 'multi-menu_second'
        }
      },
      {
        name: 'multi-menu_second_child',
        path: '/multi-menu/second/child',
        redirect: {
          name: 'multi-menu_second_child_home'
        },
        meta: {
          title: 'multi-menu_second_child'
        }
      },
      {
        name: 'multi-menu_second_child_home',
        path: '/multi-menu/second/child/home',
        component: 'view.multi-menu_second_child_home',
        meta: {
          title: 'multi-menu_second_child_home'
        }
      }
    ]
  },
  {
    name: 'user',
    path: '/user',
    component: 'layout.base',
    redirect: {
      name: 'user_list'
    },
    meta: {
      title: 'user',
      requiresAuth: true
    },
    children: [
      {
        name: 'user_detail',
        path: '/user/detail/:id',
        component: 'view.user_detail',
        meta: {
          title: 'user_detail'
        }
      },
      {
        name: 'user_list',
        path: '/user/list',
        component: 'view.user_list',
        meta: {
          title: 'user_list'
        }
      }
    ]
  },
  {
    path: '/user-center',
    component: 'layout.base',
    children: [
      {
        name: 'user-center',
        path: '',
        component: 'view.user-center',
        meta: {
          title: 'user-center',
          requiresAuth: true
        }
      }
    ]
  }
];
