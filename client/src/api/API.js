import axios from 'axios';

//Search functions to connect with back-end
export default {
  getAuthStatus: function(token) {
    return axios.post('/api/', {token});
  },
  refreshToken: function() {
    return axios.post('/api/refreshtoken');
  },
  login: function(email, password) {
    return axios.post('/api/login', {email, password});
  },
  signUp: function(email, password, firstName, lastName, className, majorName, year, phone, code, activeCode) {
    let body = {email, password, firstName, lastName, className, majorName, year, phone, code, activeCode};
    return axios.post('/api/signup', body);
  },
  logout: function() {
    return axios.post('/api/logout');
  },
  merit: function(token, pledgeName, activeName, description, amount, photoURL) {
    let body = {token, pledgeName, activeName, description, amount, photoURL};
    return axios.post('/api/merit', body);
  },
  complain: function(token, activeName, pledgeName, description) {
    return axios.post('/api/complain', {token, activeName, pledgeName, description});
  },
  getPledges: function() {
    return axios.post('/api/pledges');
  },
  getActiveMerits: function(pledge) {
    return axios.post('/api/activemerits', {pledge})
  },
  getPledgeData: function() {
    return axios.post('/api/pledgedata');
  }
};