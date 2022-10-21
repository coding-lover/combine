# vue combine
## 环境安装
- [Visual Studio C++ 依赖库安装](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/) 勾上使用C++桌面开发
![Visual Studio C++ 依赖库安装](./public/vs-install.png) 

- [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section) 选择常青版引导程序即可

- Rustc（[64位下载](https://win.rustup.rs/x86_64)｜[32位下载](https://win.rustup.rs/i686)）
    1. 检查是否安装成功  
      `rustc --version` //检查rust版本 <br>
      `cargo --version` //检查cargo版本 <br>
    2. 修改rust的Cargo源, 找到rust的安装目录 `C:\Users\[当前用户名]\.cargo`，新建 config 文件，注意不要添加后缀名；在config 文件添加下面的内容
        ```bash
        [source.crates-io]
        registry = "https://github.com/rust-lang/crates.io-index"
        
        # 替换成你偏好的镜像源
        replace-with = 'tuna'
        
        # 清华大学
        [source.tuna]
        registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
        ```
    3. 安装 `tauri-bundler`  和 `tauri-cli`   
    `cargo install tauri-bundler --force`  可能需要挺长时间，要不着急  
    `cargo install tauri-cli`
    
    
- [安装 node 环境](https://blog.csdn.net/m0_67393413/article/details/125345980)
- [安装代码编辑器vsCode](http://vscode.bianjiqi.net/)
- [安装代码版本管理工具githubDesk](https://desktop.github.com/)

## 目录说明
```$xslt
├── Aa.nc  
├── LICENSE  
├── LICENSE\ 2  
├── README.md          #帮助说明  
├── babel.config.js    #vue 配置文件  
├── dist               #vue 打包后的文件  
├── node_modules       #vue 依赖包  
├── package-lock.json  
├── package.json       #依赖包配置文件  
├── postcss.config.js  
├── public             #公共资源文件  
├── run-build.sh       #执行项目build的脚本  
├── run-dev.sh         #执行项目的脚本  
├── src                #vue 框架的代码  
    ├── api            #调用后端接口  
    ├── assets         #公用资源  
    ├── components     #组件  
    ├── router         #路由配置文件 
    ├── utils          #公共函数 
    ├── App.vue        #vue框架入口   
    └── main.js        #vue框架入口   
├── src-tauri          #tauri 框架  
    ├── App
    ├── icons
    ├── src    
        ├── main.rs    #rust 的调用入口 （可以在这里编写一些 rust api）     
    ├── static
    ├── target          #编译后的文件
    ├── Cargo.lock
    ├── Cargo.toml      #cargo 配置文件
    ├── build.rs
    ├── tauri.conf.json #tauri 项目配置文件
└── vue.config.js      #vue框架配置文件

```

## 项目运行
- 开发模式 `npm run tauri dev`
- 编译模式 `npm run tauri build` 生成的安装包在 release 文件里面
    ![](./public/tauri-build.png)
- 仅运行 vue 项目 ``npm run dev`` 双击 local 后面的连接
  ![编译成功](./public/vue-dev.jpeg)
  
## 最佳实践 页面 Test.vue
1. 创建页面文件，在 `src/components/page/` 下面创建文件 Test.vue
2. 编写代码，在 Test.vue 文件添加
```vue
<template>
    <div>
        这是一个测试
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    methods: {

    }
};
</script>
```
3. 添加路由，在`src/router/index.js` 文件添加`Test`页面的访问路由
```vue
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Combine.vue'),
            meta: { title: '合并' }
        },
        {
            path: '/test',  //访问路由， 可以自己定义
            component: () => import('../components/page/Test.vue'), //这里是Test.vue 的文件路径，一定要写对
            meta: { title: '测试' } //页面标题，可以自定义
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
```

要添加的代码为

```vue
{
    path: '/test',  
    component: () => import('../components/page/Test.vue'), 
    meta: { title: '测试' } 
}
```
4. 开发模式运行 vue 项目 `npm run dev`
5. 访问 `Test` 页面 [http://localhost:8083/test](http://localhost:8083/test)
6. 访问成功
![成功页面](./public/test-page.png)
7. 如果能看到6的页面，恭喜你已经实现了vue的都小页面了；如果你想在这个页面加入更丰富的功能，请参考 [element-ui](https://element.eleme.cn/#/zh-CN/component/layout), 里面有丰富组件；
你想要哪个组件，只需要把它的实例代码复制过来，基本可以使用了！
8. 此时这个应用还是web版本的，如果想把它打包成桌面安装包呢？只需要执行打包命令 `npm run tauri build` ； 由于 `/test` 页面不是项目的默认页面，所以要在`tauri`配置菜单或者在默认页面添加跳转连接来跳转到这个页面

## 相关文档
### 前端
- [标签 html 学习文档](https://www.runoob.com/html/html-tutorial.html)
- [标签 css 学习文档](https://www.runoob.com/css/css-tutorial.html)
- [vue 学习文档](https://cn.vuejs.org/guide/essentials/template-syntax.html)
- [element-ui 学习文档](https://element.eleme.cn/#/zh-CN/component/layout)

### 后端
- [tauri 学习文档](https://tauri.app/v1/guides/debugging/application)
- [rust 学习文档](https://kaisery.github.io/trpl-zh-cn/ch01-00-getting-started.html)
