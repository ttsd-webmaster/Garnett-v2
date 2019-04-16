// @flow

import axios from 'axios';
import type { SignUpParams, Merit, MeritInfo } from 'api/models';

//Search functions to connect with back-end
export default {
  // Pledge App:
  // GET requests
  getAuthStatus: function(displayName: string) {
    const params = { displayName };
    return axios.get('/api/auth', { params });
  },
  getBrothers: function() {
    return axios.get('/api/brothers');
  },
  getPledges: function(displayName: string) {
    const params = { displayName };
    return axios.get('/api/pledges', { params });
  },
  getPledgeMerits: function(pledgeName: string) {
    const params = { pledgeName };
    return axios.get('/api/pledge/merits', { params });
  },
  getPledgeComplaints: function(pledgeName: string) {
    const params = { pledgeName };
    return axios.get('/api/pledge/complaints', { params });
  },
  // PUT requests
  signUp: function(params: SignUpParams) {
    return axios.put('/api/signup', params);
  },
  forgotPassword: function(email: string) {
    return axios.put('/api/forgotpassword', { email });
  },
  logout: function() {
    return axios.put('/api/logout');
  },

  // Data App
  // GET requests
  getPhotos: function(data: Object) {
    const params = { data };
    return axios.get('/api/photos', { params });
  },
  getMyData: function(fullName: string) {
    const params = { fullName };
    return axios.get('/api/mydata', { params });
  },

  // Merit Book
  // GET requests
  getRemainingMerits: function(displayName: string, pledgeName: string) {
    const params = { displayName, pledgeName };
    return axios.get('/api/merit/active/remainingMerits', { params });
  },
  getPledgesForMerit: function(displayName: string) {
    const params = { displayName };
    return axios.get('/api/merit/active/pledges', { params });
  },
  getActivesForMerit: function(displayName: string, showAlumni?: boolean) {
    const params = { displayName, showAlumni };
    return axios.get('/api/merit/pledge/actives', { params });
  },
  getChalkboardsForMerit: function(fullName: string) {
    const params = { fullName };
    return axios.get('/api/merit/chalkboards', { params });
  },
  createMerit: function(params: MeritInfo) {
    return axios.put('/api/merit/create', params);
  },
  deleteMerit: function(displayName: string, meritToDelete: Merit) {
    return axios.put('/api/merit/delete', { displayName, meritToDelete });
  },

  // Chalkboards
  // GET requests
  getChalkboardInfo: function(title: string) {
    const params = { title };
    return axios.get('/api/chalkboard', { params });
  },
  getAttendees: function(title: string) {
    const params = { title };
    return axios.get('/api/chalkboard/attendees', { params });
  },
  // PUT requests
  createChalkboard: function(chalkboard: Object) {
    return axios.put('/api/chalkboard/create', { chalkboard });
  },
  updateChalkboard: function(chalkboard: Object) {
    return axios.put('/api/chalkboard/update', { chalkboard });
  },
  updateChalkboardMobile: function(title: string, field: string, value: any) {
    const body = { title, field, value };
    return axios.put('/api/chalkboard/mobile/update', body);
  },
  joinChalkboard: function(name: string, photoURL: string, title: string) {
    const body = { name, photoURL, title };
    return axios.put('/api/chalkboard/join', body);
  },
  deleteChalkboard: function(title: string) {
    return axios.put('/api/chalkboard/delete', { title });
  },
  leaveChalkboard: function(name: string, title: string) {
    return axios.put('/api/chalkboard/leave', { name, title });
  },

  // Complaints
  // GET requests
  getPledgesForComplaints: function() {
    return axios.get('/api/complaint/pledges');
  },
  // PUT requests
  createComplaint: function(complaint: Object, status: string) {
    return axios.put('/api/complaint/create', { complaint, status });
  },
  deleteComplaint: function(complaint: Object) {
    return axios.put('/api/complaint/delete', { complaint });
  },
  approveComplaint: function(complaint: Object) {
    return axios.put('/api/complaint/approve', { complaint });
  },

  // Notification Messaging
  // PUT requests
  saveMessagingToken: function(displayName: string, token: string) {
    const body = { displayName, token };
    return axios.put('/api/notification/saveMessageToken', body);
  },
  sendCreatedMeritNotification: function(params: MeritInfo) {
    return axios.put('/api/notification/merit/created', params);
  },
  sendDeletedMeritNotification: function(merit: Merit) {
    const body = { merit };
    return axios.put('/api/notification/merit/deleted', body);
  },
  sendCreatedChalkboardNotification: function(chalkboardTitle: string) {
    const body = { chalkboardTitle };
    return axios.put('/api/notification/chalkboard/created', body);
  },
  sendUpdatedChalkboardNotification: function(chalkboard: Object) {
    return axios.put('/api/notification/chalkboard/updated', { chalkboard });
  },
  sendJoinedChalkboardNotification: function(name: string, chalkboard: Object) {
    const body = { name, chalkboard };
    return axios.put('/api/notification/chalkboard/joined', body);
  },
  sendLeftChalkboardNotification: function(name: string, chalkboard: Object) {
    const body = { name, chalkboard };
    return axios.put('/api/notification/chalkboard/left', body);
  },
  sendPendingComplaintNotification: function(complaint: Object) {
    return axios.put('/api/notification/complaint/pending', { complaint });
  },
  sendApprovedComplaintNotification: function(complaint: Object) {
    return axios.put('/api/notification/complaint/approved', { complaint });
  },

  // Delibs App
  // PUT requests
  updateInteraction: function(
    displayName: string, 
    rusheeName: string, 
    interacted: boolean, 
    totalInteractions: number
  ) {
    const body = { displayName, rusheeName, interacted, totalInteractions };
    return axios.put('/api/interaction/update', body);
  },
  startVote: function(rusheeName: string) {
    return axios.put('/api/vote/start', { rusheeName });
  },
  endVote: function() {
    return axios.put('/api/vote/end');
  },
  voteForRushee: function(displayName: string, rushee: Object, vote: string) {
    return axios.put('/api/vote/create', { displayName, rushee, vote });
  }
};
