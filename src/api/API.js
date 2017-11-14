import axios from 'axios';

//Search functions to connect with back-end
export default {
  getAuthStatus: function() {
    return axios.post('http://localhost:4000/');
  },
  login: function(email, password) {
    return axios.post('http://localhost:4000/login', {email, password});
  },
  signUp: function(email, password, firstName, lastName, className, majorName, year, phone, code, activeCode) {
    let body = {email, password, firstName, lastName, className, majorName, year, phone, code, activeCode};
    return axios.post('http://localhost:4000/signup', body);
  },
  merit: function(token, pledgeName, activeName, description, amount, photoURL) {
    let body = {token, pledgeName, activeName, description, amount, photoURL};
    return axios.post('http://localhost:4000/merit', body);
  },
  getPledges: function(token) {
    return axios.post('http://localhost:4000/pledges', {token});
  },
  getMerits: function(token) {
    return axios.post('http://localhost:4000/merits', {token});
  }
};