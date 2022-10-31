import axios from 'axios';

export default class GenericUtil {
  constructor(endpoint) {
    this.baseUrl = `http://localhost:8080/api/${endpoint}`;

    // Bind class methods.
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  findAll() {
    return axios.get(this.baseUrl);
  }

  findOne(recordId) {
    return axios.get(`${this.baseUrl}/${recordId}`);
  }

  create(record) {
    return axios.post(`${this.baseUrl}`, record);
  }

  update(recordId, updatedRecord) {
    return axios.put(`${this.baseUrl}/${recordId}`, updatedRecord);
  }

  delete(recordId) {
    return axios.delete(`${this.baseUrl}/${recordId}`);
  }
}