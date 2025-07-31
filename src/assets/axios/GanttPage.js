import axios from '../js/base_axios'
// let jsonAxios = baseAxios.jsonAxios
// const Qs = require('qs');

export default {
    // 获取甘特图数据
    getGanttData(projectId) {
        return axios.get(`gantt/query?projectId=${projectId}`)
    },
    // 获取第一个标签的表格数据
    saveGanttData(query) {
        return axios.post(`gantt/save`, query)
    },
    // 获取字典
    getOptionsList(val) {
        return axios.get(`gantt/dictionaries?projectId=${val.projectId}&type=${val.type}`)
    },
    // 获取日历列表
    getCalendarList(projectId) {
        return axios.get(`gantt/active?projectId=${projectId}`)
    },
    // 保存日历
    saveCalendar(query) {
        return axios.post(`gantt/saveOrUpdate`, query)
    },
    // 删除日历
    deleteCalendar(id) {
        return axios.post(`gantt/delete?id=${id}`)
    },
    // 使用日历
    useCalendar(query) {
        return axios.post(`gantt/enableSaving`, query)
    }
}