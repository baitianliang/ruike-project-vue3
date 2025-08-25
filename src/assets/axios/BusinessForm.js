import axios from '../js/base_axios'
let projectId = window.top.getCurrentProjectId ? window.top.getCurrentProjectId() || '1084' : '1084'
// let jsonAxios = baseAxios.jsonAxios
// const Qs = require('qs');

export default {
    // 获取第一个标签的表格数据
    getFirstTableList() {
        return axios.get(`guidepage/getReferenceList?projectId=${projectId}`)
    },
    // 获取第二个标签表格相交数据
    getSecondData() {
        return axios.get(`guidepage/getMatrixList?projectId=${projectId}`)
    },
    // 获取第三个标签的表格数据
    getThirdTableData() {
        return axios.get(`guidepage/getRegisterList?projectId=${projectId}`)
    }
}