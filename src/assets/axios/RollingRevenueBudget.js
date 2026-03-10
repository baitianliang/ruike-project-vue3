import axios from '../js/base_axios'
const Qs = require('qs');

export default {
    // 获取页面数据
    getFormData(str, query) {
        const encryptData = `${str}&${Qs.stringify(query)}`
        return axios.get(`poilotscabin/getAnalysisReportData?${encryptData}`)
    },
}