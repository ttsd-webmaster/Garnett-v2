import axios from 'axios';

//Search functions to connect with back-end
export default {
  getAuthStatus: function() {
    return axios.post('/');
  },
  login: function(email, password) {
    return axios.post('/login', {email, password});
  },
  signUp: function(email, password, firstName, lastName, className, majorName, year, phone, code, activeCode) {
    let body = {email, password, firstName, lastName, className, majorName, year, phone, code, activeCode};
    return axios.post('/signup', body);
  },
  merit: function(token, pledgeName, activeName, description, amount, photoURL) {
    return axios.post('/merit', {token, pledgeName, activeName, description, amount, photoURL});
  },
  getPledges: function(token) {
    return axios.post('/pledges', {token});
  },
  getMerits: function(token) {
    return axios.post('/merits', {token});
  }
};