// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import element, { Table } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 生成路由实例
import router from './router';
import TreeTable from 'vue-table-with-tree-grid'
import moment from 'moment-js';
// 加载进度条
import Nprogress from 'nprogress'
// 挂载富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 挂载axios对象
import axios from 'axios';
// 通过axios请求拦截器添加token，保证拥有获取数据的权限
// 配置axios的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.defaults.headers.common['Authorization'] = window.sessionStorage.getItem('token');
axios.interceptors.request.use(config => {
  // 开始进度条
  Nprogress.start();
  return config
})
axios.interceptors.response.use(config => {
  // 完成进度条
  Nprogress.done();
  return config
})
// 注册全局组件
Vue.component('tree-table', TreeTable)
// 注册全局过滤器
Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD HH:mm:ss') {
  return moment(value).format(format)
})
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
Vue.use(element)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
