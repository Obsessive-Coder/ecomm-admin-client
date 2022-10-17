import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/products';

export default class Products_API {
  static findAll() {
    return axios.get(BASE_URL);
  }
}