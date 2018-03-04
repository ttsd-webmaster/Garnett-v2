import axios from 'axios';

//Search functions to connect with back-end
export default {
  getAuthStatus: function(user) {
    return axios.post('/api/', {user});
  },
  login: function(email, password) {
    return axios.post('/api/login', {email, password});
  },
  signUp: function(email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode) {
    let body = {email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode};
    return axios.post('/api/signup', body);
  },
  forgotPassword: function(email) {
    return axios.post('/api/forgotpassword', {email});
  },
  logout: function() {
    return axios.post('/api/logout');
  },
  setPhoto: function(displayName, url) {
    return axios.post('/api/photo', {displayName, url});
  },
  merit: function(displayName, pledgeName, activeName, description, amount, photoURL, date) {
    let body = {displayName, pledgeName, activeName, description, amount, photoURL, date};
    return axios.post('/api/merit', body);
  },
  meritAll: function(displayName, activeName, description, amount, photoURL, date) {
    let body = {displayName, activeName, description, amount, photoURL, date};
    return axios.post('/api/meritall', body);
  },
  complain: function(status, displayName, activeName, pledge, description, date) {
    return axios.post('/api/complain', {status, displayName, activeName, pledge, description, date});
  },
  approveComplaint: function(complaint) {
    return axios.post('/api/approvecomplaint', {complaint});
  },
  getPledges: function() {
    return axios.post('/api/pledges');
  },
  getPledgesForComplaints: function() {
    return axios.post('/api/pledgecomplaints');
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