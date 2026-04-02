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
        path: '/ProjectPage',
        name: '项目产品追踪',
        component: () => import('../views/projectPage.vue')
    },
    {
        path: '/VChat',
        name: 'Ai聊天室',
        component: () => import('../views/vChat.vue')
    },
    {
        path: '/visual',
        name: '大屏',
        component: () => import('../views/visual.vue'),
    },
    {
        path: '/FileList',
        name: '文件列表',
        component: () => import('../views/fileList.vue'),
    },
    {
        path: '/RollingRevenueBudget',
        name: '收入滚动预算',
        component: () => import('../views/rollingRevenueBudget.vue'),
    },
    {
        path: '/AccountsReceivable',
        name: '应收账款',
        component: () => import('../views/accountsReceivable.vue'),
    },
    {
        path: '/hastenWork',
        name: '任务催办',
        component: () => import('../views/hastenWork.vue'),
        meta: {
            type: 'DQ'
        }
    },
    {
        path: '/taskOverdueReminder',
        name: '任务超时催办',
        component: () => import('../views/hastenWork.vue'),
        meta: {
            type: 'CQ'
        }
    },
    {
        path: '/tenderBudget',
        name: '项目投标预算',
        component: () => import('../views/budgetCalculation.vue'),
        meta: {
            type: 'TB'
        }
    },
    {
        path: '/implementBudget',
        name: '项目实施预算',
        component: () => import('../views/budgetCalculation.vue'),
        meta: {
            type: 'SS'
        }
    },
    {
        path: '/FormH5',
        name: 'H5表单',
        component: () => import('../views/formH5.vue'),
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router
