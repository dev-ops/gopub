/**
 * Created by zzmhot on 2017/3/23.
 *
 * 路由Map
 *
 * @author: zzmhot
 * @github: https://github.com/zzmhot
 * @email: zzmhot@163.com
 * @Date: 2017/3/23 18:30
 * @Copyright(©) 2017 by zzmhot.
 *
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import store from 'store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Vue.use(VueRouter);

// 使用AMD方式加载
// component: resolve => () => import(['pages/home'], resolve),
const routes = [{
  path: '/home',
  name: 'home',
  components: {
    default: () => import('pages/home'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '主页',
    auth: true
  }
}, {
  path: '/conf/list',
  name: 'confList',
  components: {
    default: () => import('pages/conf/base'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '项目配置',
    auth: true
  }
}, {
  path: '/conf/update/:id',
  name: 'confUpdate',
  components: {
    default: () => import('pages/conf/save'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '修改配置',
    auth: true
  }
}, {
  path: '/conf/detection/:id',
  name: 'confDetection',
  components: {
    default: () => import('pages/conf/detection'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '检测项目',
    auth: true
  }
}, {
  path: '/conf/add',
  name: 'confAdd',
  components: {
    default: () => import('pages/conf/save'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '增加项目配置',
    auth: true
  }
}, {
  path: '/task/list',
  name: 'taskList',
  components: {
    default: () => import('pages/task/base'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '全部上线单',
    auth: true
  }
}, {
  path: '/task/searchlist',
  name: 'searchtaskList',
  components: {
    default: () => import('pages/task/searchbase'),
    menuView: () => import('components/leftSlideTologin')

  }
}, {
  path: '/task/create',
  name: 'taskCreate',
  components: {
    default: () => import('pages/task/create'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '创建上线单',
    auth: true
  }
}, {
  path: '/task/release/:id',
  name: 'taskRelease',
  components: {
    default: () => import('pages/task/release'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '部署上线',
    auth: true
  }
}, {
  path: '/task/searchrelease/:id',
  name: 'searchtaskRelease',
  components: {
    default: () => import('pages/task/searchrelease'),
    menuView: () => import('components/leftSlideTologin')
  },
  meta: {
    title: '部署上线',
    auth: true
  }
}, {
  path: '/task/mylist',
  name: 'taskMyList',
  components: {
    default: () => import('pages/task/mylist'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '我的上线单',
    auth: true
  }
}, {
  path: '/task/git',
  name: 'taskGit',
  components: {
    default: () => import('pages/task/git'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '创建上线单',
    auth: true
  }
}, {
  path: '/task/file',
  name: 'taskFile',
  components: {
    default: () => import('pages/task/file'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '创建上线单',
    auth: true
  }
}, {
  path: '/task/jenkins',
  name: 'taskJenkins',
  components: {
    default: () => import('pages/task/jenkins'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '创建上线单',
    auth: true
  }
}, {
  path: '/p2p/check',
  name: 'p2pCheck',
  components: {
    default: () => import('pages/p2p/check'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: 'agent状态查询',
    auth: true
  }
}, {
  path: '/other/noauto',
  name: 'noauto',
  components: {
    default: () => import('pages/other/noauto'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '预发布统计',
    auth: true
  }
}, {
  path: '/other/flush',
  name: 'otherFlush',
  components: {
    default: () => import('pages/task/flush'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '刷新版本号',
    auth: true
  }
}, {
  path: '/other/gitpull',
  name: 'otherGitpull',
  components: {
    default: () => import('pages/task/gitpull'),
    menuView: () => import('components/leftSlide')
  },
  meta: {
    title: '预发布git版本查看',
    auth: true
  }
}, {
  path: '/user/login',
  name: 'login',
  components: {
    fullView: () => import('pages/user/login')
  }
}, {
  path: '/user/register',
  name: 'register',
  components: {
    menuView: () => import('components/leftSlide'),
    default: () => import('pages/user/register')

  }
}, {
  path: '/user/changepasswd',
  name: 'changepasswd',
  components: {
    menuView: () => import('components/leftSlide'),
    default: () => import('pages/user/changepasswd')

  },
  meta: {
    title: '修改密码',
    auth: true
  }
}, {
  path: '/user/list',
  name: 'userList',
  components: {
    menuView: () => import('components/leftSlide'),
    default: () => import('pages/user/list')
  },
  meta: {
    title: '用户列表',
    auth: true
  }
}, {
  path: '',
  redirect: '/home'
}, {
  path: '*',
  name: 'notPage',
  components: {
    fullView: () => import('pages/error/404')
  }
}
];

const router = new VueRouter({
  routes,
  mode: 'hash', // default: hash ,history
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {x: 0, y: 0};
    }
  }
});

// 全局路由配置
// 路由开始之前的操作
router.beforeEach((to, from, next) => {
  NProgress.start();
  let toName = to.name;
  // let fromName = from.name
  let isLogin = store.state.user_info.login;

  if (!isLogin && toName === 'searchtaskList') {
    next();
  } else if (!isLogin && toName === 'searchtaskRelease') {
    next({});
  } else if (!isLogin && toName !== 'login') {
    next({
      name: 'login'
    });
  } else {
    if (isLogin && toName === 'login') {
      next({
        path: '/task/list'
      });
    } else {
      next();
    }
  }
});

// 路由完成之后的操作
router.afterEach(NProgress.done);

export default router;
