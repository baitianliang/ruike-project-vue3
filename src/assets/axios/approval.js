import axios from '../js/base_axios'
const params = window.location.href.split('?')[1] || `uuid=55BD60A1B0EF4F4991C0F761BD143058&taskId=2&bpDataId=86&bpName=uxmm&startTime=1755238559000`
// uuid=CA1439E625954FD6867892973F32DC0A&taskId=4&bpDataId=13&bpName=uxmm&startTime=1755164786000
export default {
    // 获取页面数据
    getFormData() {
        return axios.get(`api/process/query-formatted1?${params}`)
    },
    // 同意
    agreement(query) {
        return axios.post(`api/process/agreement`, query)
    },
    // 办结
    conclude(query) {
        return axios.post(`api/process/concludethematter`, query)
    },
    // 推送
    pushPms(query) {
        return axios.post(`api/dlstopmp/to-DoToDone`, query)
    },
}