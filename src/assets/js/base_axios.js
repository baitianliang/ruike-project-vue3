import axios from 'axios'

let instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    // baseURL: "/api/",
    timeout: 60 * 1000000,
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      // 'Authorization': ''
      // 'Authorization': 'Bearer 20bb9171-e1ff-4443-881b-52d3c82eeb03'
    }
})

export default instance