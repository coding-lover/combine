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
            path: '/test',
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Test.vue'),
            meta: { title: '合并' }
        },
        
        {
            path: '/account',
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/AccountsNew.vue'),
            meta: { title: '合并' }
        },


        {
            path: '*',
            redirect: '/404'
        }
    ]
});
