import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/Guide',
        name: 'guidePage',
        component: () => import('../views/guidePage.vue')
    },
    {
        path: '/AesButton',
        name: 'AesButton',
        component: () => import('../views/aesButton.vue')
    },
    {
        path: '/BusinessForm',
        name: 'BusinessForm',
        component: () => import('../views/businessForm.vue')
    },
    {
        path: '/GanttPage',
        name: 'GanttPage',
        component: () => import('../views/ganttPage.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

export default router