import axios from '../js/base_axios'
const bsTaskId = window.location.href.split('=')?.[1]
// let jsonAxios = baseAxios.jsonAxios
// const Qs = require('qs');

export default {
    getFormData(type) {
        return axios.get(`dlstopmp/getReviewRepushData?bsTaskId=${bsTaskId}&type=${type}`)
    },
    reminder(type) {
        return axios.post(`dlstopmp/urgebutton`, {bsTaskId: bsTaskId, type: type})
    },
    audit(PARTICIPANTID) {
        return axios.post(`dlstopmp/pushCompleteTodo`, {bsTaskId: bsTaskId, PARTICIPANTID: PARTICIPANTID})
    },
}