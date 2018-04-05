import axios from 'axios';

//Search functions to connect with back-end
export default {
  // Pledge App
  getAuthStatus: function(user) {
    return axios.post('/api/', {user});
  },
  getFirebaseData: function() {
    return axios.post('/api/getfirebasedata');
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
    return axios.post('/api/setphoto', {displayName, url});
  },
  getPledges: function() {
    return axios.post('/api/pledges');
  },
  getActives: function() {
    return axios.post('/api/actives');
  },
  getActiveRemainingMerits: function(displayName, pledge) {
    return axios.post('/api/activeremainingmerits', {displayName, pledge})
  },
  getPledgeMerits: function(pledge) {
    return axios.post('/api/pledgemerits', {pledge});
  },
  getPledgeData: function(displayName) {
    return axios.post('/api/pledgedata', {displayName});
  },
  merit: function(displayName, pledgeName, activeName, description, amount, photoURL, date) {
    let body = {displayName, pledgeName, activeName, description, amount, photoURL, date};
    return axios.post('/api/merit', body);
  },
  meritAll: function(displayName, activeName, description, amount, photoURL, date) {
    let body = {displayName, activeName, description, amount, photoURL, date};
    return axios.post('/api/meritall', body);
  },
  createChalkboard: function(displayName, activeName, photoURL, title, description, date, time, location) {
    let body = {displayName, activeName, photoURL, title, description, date, time, location};
    return axios.post('/api/createchalkboard', body);
  },
  editChalkboard: function(displayName, chalkboard, description, date, time, location) {
    return axios.post('/api/editchalkboard', {displayName, chalkboard, description, date, time, location});
  },
  editChalkboardMobile: function(displayName, chalkboard, field, value) {
    return axios.post('/api/editchalkboardmobile', {displayName, chalkboard, field, value});
  },
  joinChalkboard: function(name, photoURL, chalkboard) {
    return axios.post('/api/joinchalkboard', {name, photoURL, chalkboard});
  },
  removeChalkboard: function(displayName, chalkboard) {
    return axios.post('/api/removechalkboard', {displayName, chalkboard});
  },
  leaveChalkboard: function(name, chalkboard) {
    return axios.post('/api/leavechalkboard', {name, chalkboard});
  },
  getChalkboardInfo: function(title) {
    return axios.post('/api/getchalkboardinfo', {title});
  },
  getAttendees: function(chalkboard) {
    return axios.post('/api/getattendees', {chalkboard});
  },
  complain: function(status, displayName, activeName, pledge, description, date) {
    let body = {status, displayName, activeName, pledge, description, date};
    return axios.post('/api/complain', body);
  },
  removeComplaint: function(complaint) {
    return axios.post('/api/removecomplaint', {complaint});
  },
  approveComplaint: function(complaint) {
    return axios.post('/api/approvecomplaint', {complaint});
  },
  getPledgesForComplaints: function() {
    return axios.post('/api/pledgecomplaints');
  },
  saveMessagingToken: function(displayName, token) {
    return axios.post('/api/savemessagetoken', {displayName, token});
  },
  sendMessage: function(pledgeName, activeName, amount) {
    return axios.post('/api/sendmessage', {pledgeName, activeName, amount});
  },
  // Delibs App
  updateInteraction: function(displayName, rusheeName, interacted, totalInteractions) {
    return axios.post('/api/updateinteraction', {displayName, rusheeName, interacted, totalInteractions});
  },
  startVote: function(rusheeName) {
    return axios.post('/api/startvote', {rusheeName});
  },
  endVote: function() {
    return axios.post('/api/endvote');
  },
  voteForRushee: function(displayName, rushee, vote) {
    return axios.post('/api/vote', {displayName, rushee, vote});
  }
};