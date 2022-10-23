import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/products';

export default class ProductUtil {
  static findAll() {
    return axios.get(BASE_URL);
  }

  static findOne(productId) {
    return axios.get(`${BASE_URL}/${productId}`);
  }

  static update(productId, updatedProduct) {
    return axios.put(`${BASE_URL}/${productId}`, updatedProduct);
  }
}