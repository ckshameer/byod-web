import axios, { AxiosInstance } from "axios";

export default class MenuApi {
  private menuApiAxiosInstance: AxiosInstance;
  constructor() {
    this.menuApiAxiosInstance = axios.create({
      baseURL: 'https://cors-anywhere.herokuapp.com/https://sapaad-ms-refresh-menu-review.herokuapp.com/v1/'
    })
    this.menuApiAxiosInstance.defaults.headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      // "pos-api-key": "15393ab98a4f0d3d6f500e08718631c4"
      "pos-api-key": "eb815db2c37eb14303a0dbccc365e194"
      
    }
  }

  public getMenuList = (locationId: any) => {
    const result = this.menuApiAxiosInstance.get(`location/${locationId}/menu`)
      .then(response => {
        return response
      }).catch(error => {
        return error
      })
    return result
  }

  public refreshMenu = (locationId: any, body: any, headers: any) => {
    const result = this.menuApiAxiosInstance.post(`location/${locationId}/menu/refresh`, body, { headers })
      .then(response => {
        return response.data
      })
      .catch(error => {
        console.log(error)
        return error
      })
    return result
  }
}
