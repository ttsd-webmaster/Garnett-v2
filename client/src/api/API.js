import axios from 'axios';

//Search functions to connect with back-end
export default {
  // Pledge App
  getAuthStatus: function(user) {
    let body = {user};
    return axios.post('/api/', body);
  },
  getFirebaseData: function() {
    return axios.post('/api/getfirebasedata');
  },
  signUp: function(email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode) {
    let body = {email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode};
    return axios.post('/api/signup', body);
  },
  forgotPassword: function(email) {
    let body = {email};
    return axios.post('/api/forgotpassword', body);
  },
  logout: function() {
    return axios.post('/api/logout');
  },
  setPhoto: function(displayName, url) {
    let body = {displayName, url};
    return axios.post('/api/setphoto', body);
  },
  getPledges: function() {
    return axios.post('/api/pledges');
  },
  getActives: function() {
    return axios.post('/api/actives');
  },
  getPledgeData: function(displayName) {
    let body = {displayName};
    return axios.post('/api/pledgedata', body);
  },
  getPledgeMerits: function(pledgeName) {
    let body = {pledgeName};
    return axios.post('/api/pledgemerits', body);
  },
  getPledgeComplaints: function(pledgeName) {
    let body = {pledgeName};
    return axios.post('/api/pledgecomplaints', body);
  },
  // Merit Book
  merit: function(displayName, activeName, pledges, description, amount, photoURL, date, isChalkboard, status) {
    let body = {displayName, activeName, pledges, description, amount, photoURL, date, isChalkboard, status};
    return axios.post('/api/merit', body);
  },
  meritAsPledge: function(displayName, actives, description, amount, date, isChalkboard) {
    let body = {displayName, actives, description, amount, date, isChalkboard};
    return axios.post('/api/meritAsPledge', body);
  },
  removeMerit: function(displayName, merit) {
    let body = {displayName, merit};
    return axios.post('/api/removeMeritAsPledge', body);
  },
  getMeritsRemaining: function(displayName, pledgeName) {
    let body = {displayName, pledgeName};
    return axios.post('/api/meritsRemaining', body);
  },
  getPledgesForMerit: function(displayName) {
    let body = {displayName};
    return axios.post('/api/pledgesForMerit', body);
  },
  getActivesForMerit: function(displayName) {
    let body = {displayName};
    return axios.post('/api/activesForMerit', body);
  },
  getAlumniForMerit: function(displayName) {
    let body = {displayName};
    return axios.post('/api/alumniForMerit', body);
  },
  getChalkboardsForMerit: function(fullName) {
    let body = {fullName};
    return axios.post('/api/chalkboardsForMerit', body);
  },
  getPbros: function(displayName) {
    let body = {displayName};
    return axios.post('/api/getPbros', body);
  },
  // Chalkboards
  createChalkboard: function(displayName, activeName, photoURL, title, description, date, time, location, timeCommitment, amount) {
    let body = {displayName, activeName, photoURL, title, description, date, time, location, timeCommitment, amount};
    return axios.post('/api/createchalkboard', body);
  },
  editChalkboard: function(displayName, chalkboard, description, date, time, location, timeCommitment, amount) {
    let body = {displayName, chalkboard, description, date, time, location, timeCommitment, amount};
    return axios.post('/api/editchalkboard', body);
  },
  editChalkboardMobile: function(displayName, chalkboard, field, value) {
    let body = {displayName, chalkboard, field, value};
    return axios.post('/api/editchalkboardmobile', body);
  },
  joinChalkboard: function(name, photoURL, chalkboard) {
    let body = {name, photoURL, chalkboard};
    return axios.post('/api/joinchalkboard', body);
  },
  removeChalkboard: function(displayName, chalkboard) {
    let body = {displayName, chalkboard};
    return axios.post('/api/removechalkboard', body);
  },
  leaveChalkboard: function(name, chalkboard) {
    let body = {name, chalkboard};
    return axios.post('/api/leavechalkboard', body);
  },
  getChalkboardInfo: function(title) {
    let body = {title};
    return axios.post('/api/getchalkboardinfo', body);
  },
  getAttendees: function(chalkboard) {
    let body = {chalkboard};
    return axios.post('/api/getattendees', body);
  },
  // Complaints
  complain: function(complaint, status) {
    let body = {complaint, status};
    return axios.post('/api/complain', body);
  },
  removeComplaint: function(complaint) {
    let body = {complaint};
    return axios.post('/api/removecomplaint', body);
  },
  approveComplaint: function(complaint) {
    let body = {complaint};
    return axios.post('/api/approvecomplaint', body);
  },
  getPledgesForComplaints: function() {
    return axios.post('/api/pledgesForComplaints');
  },
  // Notification Messaging
  saveMessagingToken: function(displayName, token) {
    let body = {displayName, token};
    return axios.post('/api/savemessagetoken', body);
  },
  sendActiveMeritNotification: function(activeName, pledges, amount) {
    let body = {activeName, pledges, amount};
    return axios.post('/api/sendActiveMeritNotification', body);
  },
  sendPledgeMeritNotification: function(pledgeName, actives, amount) {
    let body = {pledgeName, actives, amount};
    return axios.post('/api/sendPledgeMeritNotification', body);
  },
  sendCreatedChalkboardNotification: function(chalkboardTitle) {
    let body = {chalkboardTitle};
    return axios.post('/api/sendCreatedChalkboardNotification', body);
  },
  sendEditedChalkboardNotification: function(chalkboard) {
    let body = {chalkboard};
    return axios.post('/api/sendEditedChalkboardNotification', body);
  },
  sendJoinedChalkboardNotification: function(name, chalkboard) {
    let body = {name, chalkboard};
    return axios.post('/api/sendJoinedChalkboardNotification', body);
  },
  sendLeftChalkboardNotification: function(name, chalkboard) {
    let body = {name, chalkboard};
    return axios.post('/api/sendLeftChalkboardNotification', body);
  },
  sendPendingComplaintNotification: function(complaint) {
    let body = {complaint};
    return axios.post('/api/sendPendingComplaintNotification', body);
  },
  sendApprovedComplaintNotification: function(complaint) {
    let body = {complaint};
    return axios.post('/api/sendApprovedComplaintNotification', body);
  },
  // Delibs App
  updateInteraction: function(displayName, rusheeName, interacted, totalInteractions) {
    let body = {displayName, rusheeName, interacted, totalInteractions};
    return axios.post('/api/updateinteraction', body);
  },
  startVote: function(rusheeName) {
    let body = {rusheeName};
    return axios.post('/api/startvote', body);
  },
  endVote: function() {
    return axios.post('/api/endvote');
  },
  voteForRushee: function(displayName, rushee, vote) {
    let body = {displayName, rushee, vote};
    return axios.post('/api/vote', body);
  },
  // Data App
  getPhotos: function(data) {
    let body = {data};
    return axios.post('/api/getphotos', body);
  },
  getMyData: function(fullName) {
    let body = {fullName};
    return axios.post('/api/getmydata', body);
  }
};
