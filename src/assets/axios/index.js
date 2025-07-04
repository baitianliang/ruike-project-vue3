import axios from '../js/base_axios'
let projectId = window.parent._P ? window.parent._P.projectId || '1010' : '1010'

export default {
    // 获取菜单接口
    getMenuList() {
        return axios.get(`guidepage/getNavigationTree?projectId=${projectId}`)
    },
    // 二级菜单获取页面信息
    getPageData(val) {
        return axios.get(`guidepage/getNavigationTreeItem?projectId=${projectId}${val.twoid ? '&twoid=' + val.twoid : ''}${val.id ? '&id=' + val.id : ''}`)
    }
}