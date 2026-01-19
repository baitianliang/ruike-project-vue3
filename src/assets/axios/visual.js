import axios from '../js/base_axios'

export default {
    // 获取页面数据
    getFormData(str) {
        return axios.get(`poilotscabin/getPscPictureData?${str}`)
    },
    // 获取表格数据
    getTableData(str) {
        return axios.get(`poilotscabin/getDrillDownList?${str}`)
    },
}