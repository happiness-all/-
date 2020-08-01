import vue from 'vue';
import router from 'vue-router';
vue.use(router);
// 引用路由文件
import login from '../pages/login';
import layout from '../pages/layout';
import index from '../components/index';
import menu from '../components/menu';
import role from '../components/role';
import user from '../components/user';
import specs from '../components/specs';
import seckill from '../components/seckill';
import goods from '../components/goods';
import category from '../components/category';
import banner from '../components/banner';
import member from '../components/member';
// 暴露组件
export default new router({
    routes: [
        {
            path: '/login',
            component: login
        },
        {
            path: '/',
            component: layout,
            children: [
                {
                    path: '/index',
                    component: index

                }, {
                    path: '/menu',
                    component: menu
                }, {
                    path: '/role',
                    component: role
                }, {
                    path: '/user',
                    component: user
                }, {
                    path: '/category',
                    component: category
                }, {
                    path: '/specs',
                    component: specs
                }, {
                    path: '/goods',
                    component: goods
                }, {
                    path: '/member',
                    component: member
                }, {
                    path: '/banner',
                    component: banner
                }, {
                    path: '/seckill',
                    component: seckill
                }
            ]
        }
    ]
})