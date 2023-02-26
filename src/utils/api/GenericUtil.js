import axios from 'axios';
import store from '../../store';

export default class GenericUtil {
  constructor(endpoint) {
    const { REACT_APP_ENV, REACT_APP_LOCAL_BASE_URL, REACT_APP_LIVE_BASE_URL } = process.env;
    const serverUrl = REACT_APP_ENV === 'local' ? REACT_APP_LOCAL_BASE_URL : REACT_APP_LIVE_BASE_URL;
    this.baseUrl = `${serverUrl}/${endpoint}`

    // Bind class methods.
    this.getConfig = this.getConfig.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  getConfig() {
    const { user: { value: { accessToken } } } = store.getState();

    if (!accessToken) {
      console.log('No access token is available. Please reauthenticate and try again.');
      return;
    };

    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },

    };
  }

  findAll(params) {
    const config = this.getConfig()
    if (!config) return;
    return axios.get(this.baseUrl, { params, ...config });
  }

  findOne(recordId) {
    const config = this.getConfig()
    if (!config) return;
    return axios.get(`${this.baseUrl}/${recordId}`, { ...config });
  }

  create(record) {
    const config = this.getConfig()
    if (!config) return;
    return axios.post(`${this.baseUrl}`, record, { ...config });
  }

  update(recordId, updatedRecord) {
    const config = this.getConfig()
    if (!config) return;
    return axios.put(`${this.baseUrl}/${recordId}`, updatedRecord, { ...config });
  }

  delete(recordId) {
    const config = this.getConfig()
    if (!config) return;
    return axios.delete(`${this.baseUrl}/${recordId}`, { ...config });
  }
}