import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: '导航页',
        component: () => import('../views/home.vue'),
        meta: {
            hidden: true
        }
    },
    {
        path: '/Guide',
        name: '引导页',
        component: () => import('../views/guidePage.vue')
    },
    {
        path: '/AesButton',
        name: '跳转BIM系统',
        component: () => import('../views/aesButton.vue')
    },
    {
        path: '/BusinessForm',
        name: '接口报表',
        component: () => import('../views/businessForm.vue')
    },
    {
        path: '/GanttPage',
        name: '甘特图操作页',
        component: () => import('../views/ganttPage.vue')
    },
    {
        path: '/GanttShow',
        name: '甘特图展示页',
        component: () => import('../views/ganttPage.vue')
    },
    {
        path: '/ApprovalPage',
        name: '审批流程页',
        component: () => import('../views/approvalPage.vue')
    },
    {
        path: '/FinishedProjectPage',
        name: '已办',
        component: () => import('../views/finishedProjectPage.vue')
    },
    {
        path: '/VChat',
        name: 'Ai聊天室',
        component: () => import('../views/vChat.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router