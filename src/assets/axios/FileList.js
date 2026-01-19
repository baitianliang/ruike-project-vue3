import axios from '../js/base_axios'
let params = window.location.href.split('?')[1] || `bpid=uxpi&projectId=1009`
// params = params.replace('project_id', 'projectId')

export default {
    // 获取表格数据
    getTableData() {
        return axios.get(`strengthen/file/AttachmentQuery?${params}`)
    },
    // 下载文件
    downloadFile(data) {
        return axios.get(`strengthen/file/download?${data}`, {responseType: 'blob'})
    }
}