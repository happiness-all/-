import vue from 'vue';
import router from 'vue-router';
vue.use(router);
// 引用路由文件
import login from "../components/login";
import layout from '../payload/layout';
import index from '../components/index';
import roles from '../components//power/roles';
import user from '../components/user';
import cate from '../components/goods/cart'
import rights from '../components/power/rights'
import goods from '../components/goods/goods'
import Add from '../components/goods/Add'
import edit from '../components/goods/editgoods'
import orders from '../components/orders/order'
import reports from '../components/reports'
import params from '../components/goods/params'
// 暴露组件
let Router = new router({
    routes: [
        {
            path: '/login',
            component: login
        },
        {
            path: '/home',
            component: layout,
            children: [
                {
                    path: '/index',
                    component: index

                }, {
                    path: '/roles',
                    component: roles
                }, {
                    path: '/users',
                    component: user
                }, {
                    path: '/categories',
                    component: cate
                },
                {
                    path: '/rights',
                    component: rights
                },
                {
                    path: '/goods',
                    component: goods
                },
                {
                    path: '/goods/add',
                    component: Add
                }, {
                    path: '/goods/edit/:id',
                    component: edit
                }, {
                    path: '/orders',
                    component: orders
                }, {
                    path: '/reports',
                    component: reports
                }, {
                    path: '/params',
                    component: params
                }
            ]
        }
    ],
})
// 挂载路由导航守卫
Router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        next();
    } else {
        let token = window.sessionStorage.getItem('token');
        if (!token) {
            sessionStorage.setItem("token", '');
            next('/login')
        } else {
            next();
        }
    }
})
export default Router;