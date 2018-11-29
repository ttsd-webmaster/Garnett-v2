import axios from 'axios';

//Search functions to connect with back-end
export default {
  // Pledge App:
  // GET requests
  getAuthStatus: function(displayName) {
    const params = { displayName };
    return axios.get('/api/auth', { params });
  },
  getActives: function() {
    return axios.get('/api/actives');
  },
  getPledgeMerits: function(pledgeName) {
    const params = { pledgeName };
    return axios.get('/api/pledge/merits', { params });
  },
  getPledgeComplaints: function(pledgeName) {
    const params = { pledgeName };
    return axios.get('/api/pledge/complaints', { params });
  },
  // PUT requests
  signUp: function(email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode) {
    const body = { email, password, firstName, lastName, className, majorName, year, phone, code, pledgeCode };
    return axios.put('/api/signup', body);
  },
  forgotPassword: function(email) {
    const body = { email };
    return axios.put('/api/forgotpassword', body);
  },
  logout: function() {
    return axios.put('/api/logout');
  },

  // Data App
  // GET requests
  getPhotos: function(data) {
    const params = { data };
    return axios.get('/api/photos', { params });
  },
  getMyData: function(fullName) {
    const params = { fullName };
    return axios.get('/api/mydata', { params });
  },

  // Merit Book
  // GET requests
  getMeritsRemaining: function(displayName, pledgeName) {
    const params = { displayName, pledgeName };
    return axios.get('/api/merit/active/remaining', { params });
  },
  getPledgesForMerit: function(displayName) {
    const params = { displayName };
    return axios.get('/api/merit/active/pledges', { params });
  },
  getPledgesForMeritMobile: function(displayName) {
    const params = { displayName };
    return axios.get('/api/merit/active/pledges/mobile', { params });
  },
  getActivesForMerit: function(displayName) {
    const params = { displayName };
    return axios.get('/api/merit/pledge/actives', { params });
  },
  getActivesForMeritMobile: function(displayName) {
    const params = { displayName };
    return axios.get('/api/merit/pledge/actives/mobile', { params });
  },
  getAlumniForMerit: function(displayName) {
    const params = { displayName };
    return axios.get('/api/merit/pledge/alumni', { params });
  },
  getAlumniForMeritMobile: function(displayName) {
    const params = { displayName };
    return axios.get('/api/merit/pledge/alumni/mobile', { params });
  },
  getChalkboardsForMerit: function(fullName) {
    const params = { fullName };
    return axios.get('/api/merit/chalkboards', { params });
  },
  getPbros: function(displayName) {
    const params = { displayName };
    return axios.get('/api/merit/pledge/pbros', { params });
  },
  meritAsActive: function(displayName, selectedPledges, merit, isChalkboard, isPCGreet, status) {
    const body = { displayName, selectedPledges, merit, isChalkboard, isPCGreet, status };
    return axios.put('/api/merit/active/create', body);
  },
  meritAsPledge: function(displayName, selectedActives, merit, isChalkboard, isPCGreet) {
    const body = { displayName, selectedActives, merit, isChalkboard, isPCGreet };
    return axios.put('/api/merit/pledge/create', body);
  },
  deleteMerit: function(displayName, merit) {
    const body = { displayName, merit };
    return axios.put('/api/merit/pledge/delete', body);
  },

  // Chalkboards
  // GET requests
  getChalkboardInfo: function(title) {
    const params = { title };
    return axios.get('/api/chalkboard', { params });
  },
  getAttendees: function(title) {
    const params = { title };
    return axios.get('/api/chalkboard/attendees', { params });
  },
  // PUT requests
  createChalkboard: function(chalkboard) {
    const body = { chalkboard };
    return axios.put('/api/chalkboard/create', body);
  },
  updateChalkboard: function(chalkboard) {
    const body = { chalkboard };
    return axios.put('/api/chalkboard/update', body);
  },
  updateChalkboardMobile: function(title, field, value) {
    const body = { title, field, value };
    return axios.put('/api/chalkboard/mobile/update', body);
  },
  joinChalkboard: function(name, photoURL, title) {
    const body = { name, photoURL, title };
    return axios.put('/api/chalkboard/join', body);
  },
  deleteChalkboard: function(title) {
    const body = { title };
    return axios.put('/api/chalkboard/delete', body);
  },
  leaveChalkboard: function(name, title) {
    const body = { name, title };
    return axios.put('/api/chalkboard/leave', body);
  },

  // Complaints
  // GET requests
  getPledgesForComplaints: function() {
    return axios.get('/api/complaint/pledges');
  },
  // PUT requests
  createComplaint: function(complaint, status) {
    const body = { complaint, status };
    return axios.put('/api/complaint/create', body);
  },
  deleteComplaint: function(complaint) {
    const body = { complaint };
    return axios.put('/api/complaint/delete', body);
  },
  approveComplaint: function(complaint) {
    const body = { complaint };
    return axios.put('/api/complaint/approve', body);
  },

  // Notification Messaging
  // PUT requests
  saveMessagingToken: function(displayName, token) {
    const body = { displayName, token };
    return axios.put('/api/notification/saveMessageToken', body);
  },
  sendPledgeMeritNotification: function(activeName, pledges, amount) {
    const body = { activeName, pledges, amount };
    return axios.put('/api/notification/merit/activeCreated', body);
  },
  sendActiveMeritNotification: function(pledgeName, actives, amount) {
    const body = { pledgeName, actives, amount };
    return axios.put('/api/notification/merit/pledgeCreated', body);
  },
  sendCreatedChalkboardNotification: function(chalkboardTitle) {
    const body = { chalkboardTitle };
    return axios.put('/api/notification/chalkboard/created', body);
  },
  sendUpdatedChalkboardNotification: function(chalkboard) {
    const body = { chalkboard };
    return axios.put('/api/notification/chalkboard/updated', body);
  },
  sendJoinedChalkboardNotification: function(name, chalkboard) {
    const body = { name, chalkboard };
    return axios.put('/api/notification/chalkboard/joined', body);
  },
  sendLeftChalkboardNotification: function(name, chalkboard) {
    const body = { name, chalkboard };
    return axios.put('/api/notification/chalkboard/left', body);
  },
  sendPendingComplaintNotification: function(complaint) {
    const body = { complaint };
    return axios.put('/api/notification/complaint/pending', body);
  },
  sendApprovedComplaintNotification: function(complaint) {
    const body = { complaint };
    return axios.put('/api/notification/complaint/approved', body);
  },

  // Delibs App
  // PUT requests
  updateInteraction: function(displayName, rusheeName, interacted, totalInteractions) {
    const body = { displayName, rusheeName, interacted, totalInteractions };
    return axios.put('/api/interaction/update', body);
  },
  startVote: function(rusheeName) {
    const body = { rusheeName };
    return axios.put('/api/vote/start', body);
  },
  endVote: function() {
    return axios.put('/api/vote/end');
  },
  voteForRushee: function(displayName, rushee, vote) {
    const body = { displayName, rushee, vote };
    return axios.put('/api/vote/create', body);
  }
};
