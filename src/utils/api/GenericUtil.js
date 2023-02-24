import axios from 'axios';

export default class GenericUtil {
  constructor(endpoint) {
    // this.baseUrl = `http://localhost:8080/api/${endpoint}`;
    // this.baseUrl = ` https://ecomm-server-dev-env.eba-rzt7pshn.us-east-1.elasticbeanstalk.com/api/${endpoint}`;

    const { REACT_APP_ENV, REACT_APP_LOCAL_BASE_URL, REACT_APP_LIVE_BASE_URL } = process.env;
    const serverUrl = REACT_APP_ENV === 'local' ? REACT_APP_LOCAL_BASE_URL : REACT_APP_LIVE_BASE_URL;
    this.baseUrl = `${serverUrl}/${endpoint}`


    // Bind class methods.
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  findAll(params) {
    return axios.get(this.baseUrl, { params });
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