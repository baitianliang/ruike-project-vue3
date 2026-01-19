import axios from '../js/base_axios'
let projectId = window.top.getCurrentProjectId ? window.top.getCurrentProjectId() : window.opener?.opener?.getCurrentProjectId() || ''
projectId = projectId || window.opener?.top?.getCurrentProjectId() || '1090'
// let jsonAxios = baseAxios.jsonAxios
const Qs = require('qs');

export default {
    getTableData(query) {
        return axios.get(`strengthen/projectProductTableList?projectId=${projectId}&${Qs.stringify(query)}`)
    },
    updateProject(dataList) {
        return axios.post(`strengthen/projectProductBatchSave`, dataList)
    }
}