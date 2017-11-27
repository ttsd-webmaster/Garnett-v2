import axios from 'axios';

//Search functions to connect with back-end
export default {
  getAuthStatus: function(user) {
    return axios.post('/api/', {user});
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
  setPhoto: function(url, token) {
    return axios.post('/api/photo', {url, token});
  },
  merit: function(pledgeName, activeName, description, amount, photoURL, date) {
    let body = {pledgeName, activeName, description, amount, photoURL, date};
    return axios.post('/api/merit', body);
  },
  meritAll: function(activeName, description, amount, photoURL, date) {
    let body = {activeName, description, amount, photoURL, date};
    return axios.post('/api/meritall', body);
  },
  complain: function(activeName, pledgeName, description) {
    return axios.post('/api/complain', {activeName, pledgeName, description});
  },
  getPledges: function() {
    return axios.post('/api/pledges');
  },
  getActives: function() {
    return axios.post('/api/actives');
  },
  getActiveMerits: function(pledge) {
    return axios.post('/api/activemerits', {pledge})
  },
  getPledgeData: function() {
    return axios.post('/api/pledgedata');
  }
};