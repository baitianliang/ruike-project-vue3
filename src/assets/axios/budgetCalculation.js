import axios from '../js/base_axios'
const Qs = require('qs');

export default {
    // 获取页面数据
    getTbTableData(crrcBoiQqxmbh, crrcPasdBbh) {
        return axios.get(`strengthen/getDataByCrrcPasdBbh?crrcBoiQqxmbh=${crrcBoiQqxmbh}&crrcPasdBbh=${crrcPasdBbh}`)
    },
    getSsTableData(crrcXmXmbh, crrcPasdBbh) {
        return axios.get(`strengthen/getProImplementationData?crrcXmXmbh=${crrcXmXmbh}&crrcPasdBbh=${crrcPasdBbh}`)
    },
    // 保存页面数据
    saveTbTableData(query) {
        return axios.post(`strengthen/saveData`, query)
    },
    saveSsTableData(query) {
        return axios.post(`strengthen/saveProImplementationData`, query)
    },
}