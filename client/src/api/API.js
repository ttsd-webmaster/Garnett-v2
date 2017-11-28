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
  setPhoto: function(displayName, url, token) {
    return axios.post('/api/photo', {displayName, url, token});
  },
  merit: function(displayName, pledgeName, activeName, description, amount, photoURL, date) {
    let body = {displayName, pledgeName, activeName, description, amount, photoURL, date};
    return axios.post('/api/merit', body);
  },
  meritAll: function(displayName, activeName, description, amount, photoURL, date) {
    let body = {displayName, activeName, description, amount, photoURL, date};
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
  getActiveMerits: function(displayName, pledge) {
    return axios.post('/api/activemerits', {displayName, pledge})
  },
  getPledgeData: function(displayName) {
    return axios.post('/api/pledgedata', {displayName});
  },
  saveMessagingToken: function(displayName, token) {
    return axios.post('/api/savemessagetoken', {displayName, token});
  },
  sendMessage: function(pledgeName, activeName, amount) {
    return axios.post('/api/sendmessage', {pledgeName, activeName, amount});
  }
};