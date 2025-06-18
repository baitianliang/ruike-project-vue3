import axios from '../js/base_axios'
let projectId = window.parent._P ? window.parent._P.projectId || '1030' : '1030'
// let jsonAxios = baseAxios.jsonAxios
// const Qs = require('qs');

export default {
    // 获取第一个标签的表格数据
    getFirstTableList() {
        return axios.get(`getReferenceList?projectId=${projectId}`)
    },
    // 获取第二个标签表格相交数据
    getSecondData() {
        return axios.get(`getMatrixList?projectId=${projectId}`)
    },
    // 获取第三个标签的表格数据
    getThirdTableData() {
        return axios.get(`getRegisterList?projectId=${projectId}`)
    }
}