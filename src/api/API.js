import axios from "axios";

//Search functions to connect with back-end
export default {
  login: function(username,password) {
    return axios.post("/login", {username,password});
  },
  getPledges : function(token){
    return axios.post("/pledges", {token});
  }

};