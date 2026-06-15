import axios from 'axios'
import Cookies from 'js-cookie';
const Qs = require('qs');


let instance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 60 * 1000000,
})
instance.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
    async getDate(taskId) {
        const res = await instance.post(`h5/api/token` , {
            clientId: "mobile-terminal",
            clientSecret: "h5-mobile-terminal-secret"
        })
        instance.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`
        return instance.get(`h5/api/getApproverStatus?taskId=${taskId}`)
    },
    getFileList(query) {
        return instance.get(`h5/api/file/getfileinformation?model=${query.model}&parentId=${query.parentId}`)
    },
    pushPu(query) {
        return instance.post(`h5/api/gateway/dispatch`, query)
    },
    async getList() {
        const res = await instance.post(`h5/api/token` , {
            clientId: "mobile-terminal",
            clientSecret: "h5-mobile-terminal-secret"
        })
        instance.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`
        return instance.get(`h5/api/toDoList/getToDoListQuery?${window.location.href.split('?')?.[1] || "username=coadmin"}`)
    },
    pushPms(query) {
        return instance.post(`dlstopms/req/dispatcher`, query)
    },
    doToDone(query) {
        return instance.post(`dlstopmp/to-DoToDone`, query)
    },
    pushTodo(query) {
        return instance.post(`dlstopmp/pushTodoItems`, query)
    },
}