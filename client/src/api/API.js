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
  getPledgeData: function(displayName) {
    return axios.post('/api/pledgedata', {displayName});
  },
  getPledgeMerits: function(pledgeName) {
    return axios.post('/api/pledgemerits', {pledgeName});
  },
  getPledgeComplaints: function(pledgeName) {
    return axios.post('/api/pledgecomplaints', {pledgeName});
  },
  merit: function(displayName, activeName, pledges, description, amount, photoURL, date, isChalkboard, status) {
    let body = {displayName, activeName, pledges, description, amount, photoURL, date, isChalkboard, status};
    return axios.post('/api/merit', body);
  },
  meritAsPledge: function(displayName, actives, description, amount, date, isChalkboard) {
    let body = {displayName, actives, description, amount, date, isChalkboard};
    return axios.post('/api/meritAsPledge', body);
  },
  removeMerit: function(displayName, merit) {
    return axios.post('/api/removeMeritAsPledge', {displayName, merit});
  },
  getMeritsRemaining: function(displayName, pledgeName) {
    return axios.post('/api/meritsRemaining', {displayName, pledgeName});
  },
  getPledgesForMerit: function(displayName) {
    return axios.post('/api/pledgesForMerit', {displayName});
  },
  getActivesForMerit: function(displayName) {
    return axios.post('/api/activesForMerit', {displayName});
  },
  getChalkboardsForMerit: function(fullName) {
    return axios.post('/api/chalkboardsForMerit', {fullName});
  },
  getPbros: function(displayName) {
    return axios.post('/api/getPbros', {displayName});
  },
  createChalkboard: function(displayName, activeName, photoURL, title, description, date, time, location, timeCommitment, amount) {
    let body = {displayName, activeName, photoURL, title, description, date, time, location, timeCommitment, amount};
    return axios.post('/api/createchalkboard', body);
  },
  editChalkboard: function(displayName, chalkboard, description, date, time, location, timeCommitment, amount) {
    return axios.post('/api/editchalkboard', {displayName, chalkboard, description, date, time, location, timeCommitment, amount});
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
  complain: function(complaint, status) {
    return axios.post('/api/complain', {complaint, status});
  },
  removeComplaint: function(complaint) {
    return axios.post('/api/removecomplaint', {complaint});
  },
  approveComplaint: function(complaint) {
    return axios.post('/api/approvecomplaint', {complaint});
  },
  getPledgesForComplaints: function() {
    return axios.post('/api/pledgesForComplaints');
  },
  // Notification Messaging
  saveMessagingToken: function(displayName, token) {
    return axios.post('/api/savemessagetoken', {displayName, token});
  },
  sendActiveMeritNotification: function(activeName, pledges, amount) {
    return axios.post('/api/sendActiveMeritNotification', {activeName, pledges, amount});
  },
  sendPledgeMeritNotification: function(pledgeName, actives, amount) {
    return axios.post('/api/sendPledgeMeritNotification', {pledgeName, actives, amount});
  },
  sendCreatedChalkboardNotification: function(chalkboardTitle) {
    return axios.post('/api/sendCreatedChalkboardNotification', {chalkboardTitle});
  },
  sendEditedChalkboardNotification: function(chalkboard) {
    return axios.post('/api/sendEditedChalkboardNotification', {chalkboard});
  },
  sendJoinedChalkboardNotification: function(name, chalkboard) {
    return axios.post('/api/sendJoinedChalkboardNotification', {name, chalkboard});
  },
  sendLeftChalkboardNotification: function(name, chalkboard) {
    return axios.post('/api/sendLeftChalkboardNotification', {name, chalkboard});
  },
  sendPendingComplaintNotification: function(complaint) {
    return axios.post('/api/sendPendingComplaintNotification', {complaint});
  },
  sendApprovedComplaintNotification: function(complaint) {
    return axios.post('/api/sendApprovedComplaintNotification', {complaint});
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