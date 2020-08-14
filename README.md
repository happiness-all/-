#### 项目解读 ####

本项目主要是由element-ui框架和vue框架组合而成的后台管理项目，并引入了loadsh等常用js库。

前端解决跨域问题

在config --index.js中设置

```js
proxyTable: {
       // 跨域代理问题，d代理设置
       // '/api'请求会被捕捉并代码
       '/api': {
         //需要代理的目标地址
         target: 'http://localhost:3000',
         changeOrigin: true,//是否跨域
         //地址改写  若后台的请求地址与前端不一样可以用此方法改写
         PathRewrite: {
           '/api': '/',//改写后的数据
         }
       }
```

本项目采用的是后台处理跨域