import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://cors-anywhere.herokuapp.com/https://sapaad-ms-refresh-menu-review.herokuapp.com/v1/',
  responseType: 'json',
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "pos-api-key": "eb815db2c37eb14303a0dbccc365e194",
    "X-User-Agent":"web_byod",
    "X-App-Version":`${process.env.REACT_APP_VERSION}`
  }
})

export const setAuthHeader = (requestHeaders: any) => {
  axios.defaults.headers = requestHeaders
}

export default axiosClient
 