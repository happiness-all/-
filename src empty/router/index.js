import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/pages/Login'
import Layout from '@/components/pages/Layout'
import Index from '@/components/pages/Index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },{
      path:"/",
      component:Layout,
      children:[{
        path:"index",
        component:Index,
      },{
        path:"",
        redirect:"/index",
      }]
    }
  ]
})
