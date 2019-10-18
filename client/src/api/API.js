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
  logOut: function() {
    return axios.put('/api/logout');
  },

  // Data App
  // GET requests
  getPledgingData: function() {
    return axios.get('/api/data/pledging');
  },
  getMyData: function(fullName: string) {
    const params = { fullName };
    return axios.get('/api/data/mydata', { params });
  },

  // Merit Book
  // GET requests
  getAllMerits: function(lastKey: { value?: string, key?: string }) {
    const params = { lastKey };
    return axios.get('/api/merit/all', { params });
  },
  getAllMeritsReverse: function(lastKey: { value?: string, key?: string }) {
    const params = { lastKey };
    return axios.get('/api/merit/all/reverse', { params });
  },
  getPledgeMerits: function(pledgeName: string) {
    const params = { pledgeName };
    return axios.get('/api/merit/pledge/merits', { params });
  },
  getRemainingMerits: function(fullName: string, pledgeName: string, status: string) {
    const params = { fullName, pledgeName, status };
    return axios.get('/api/merit/active/remainingMerits', { params });
  },
  getPledgesForMerit: function(fullName: string, status: string) {
    const params = { fullName, status };
    return axios.get('/api/merit/pledges', { params });
  },
  getActivesForMerit: function(fullName: string, showAlumni?: boolean) {
    const params = { fullName, showAlumni };
    return axios.get('/api/merit/actives', { params });
  },
  getChalkboardsForMerit: function(fullName: string) {
    const params = { fullName };
    return axios.get('/api/merit/chalkboards', { params });
  },
  createMerit: function(params: MeritInfo) {
    return axios.put('/api/merit', params);
  },
  updateMerit: function(displayName: string, status: string, meritToEdit: Merit, date: Date) {
    const body = { displayName, status, meritToEdit, date };
    return axios.put('/api/merit/update', body);
  },
  deleteMerit: function(displayName: string, status: string, meritToDelete: Merit) {
    const body = { displayName, status, meritToDelete };
    return axios.delete('/api/merit', { data: body });
  },

  // Interviews
  // GET requests
  getInterviewsProgress: function(fullName: string, status: string) {
    const params = { fullName, status };
    return axios.get('/api/interview', { params });
  },
  getPledgeCompletedInterviews: function(pledgeName: string) {
    const params = { pledgeName };
    return axios.get('/api/interview/pledge', { params });
  },
  // PUT requests
  completeInterview: function(activeName: string, pledgeName: string) {
    const body = { activeName, pledgeName };
    return axios.put('/api/interview', body);
  },
  deleteInterview: function(activeName: string, pledgeName: string) {
    const body = { activeName, pledgeName };
    return axios.delete('/api/interview', { data: body });
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
  leaveChalkboard: function(name: string, title: string) {
    return axios.put('/api/chalkboard/leave', { name, title });
  },
  deleteChalkboard: function(title: string) {
    return axios.delete('/api/chalkboard', { data: { title } });
  },

  // Complaints
  // GET requests
  getPledgesForComplaints: function() {
    return axios.get('/api/complaint/pledges');
  },
  // PUT requests
  createComplaint: function(complaint: Object, status: string) {
    return axios.put('/api/complaint', { complaint, status });
  },
  approveComplaint: function(complaint: Object) {
    return axios.put('/api/complaint/approve', { complaint });
  },
  deleteComplaint: function(complaint: Object) {
    return axios.delete('/api/complaint', { data: { complaint } });
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
