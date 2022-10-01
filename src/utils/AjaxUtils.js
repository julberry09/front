import axios from 'axios';

const AjaxUtils = {
  BASE_URL: process.env.REACT_APP_API_SERVER,

  ajaxGet: async function () {
    const data = {
      name: document.getElementById('name').value
    }
    const response = await axios.get(this.BASE_URL + '/api/hello', data);
    return response.data;
  },

  ajaxPost: async function () {
    const data = {
      name: document.getElementById('name').value
    }
    const response = await axios.post(this.BASE_URL + '/api/hello', data);
    return response.data;
  },

  getPartyList: async function (query) {
    console.log(query);
    const resposne = await axios.get('http://localhost:8080/api/partyInfos/carpool-now-list?condition='+query.condition);
    console.log(resposne);
    return resposne.data;
  }

  // getPartyList: async function (query) {
  //   console.log(this.BASE_URL + '/partyInfoes');
  //   const resposne = await axios.get('http://localhost:8080/partyInfoes');
  //   return resposne.data._embedded;
  // }
// callback 을 사용할 때,
  // getPartyList: async function() {
  //   const url = "http://localhost:8081/partyInfos/partyinfoes";
  //   //const url = 'https://jsonplaceholder.typicode.com/posts/1';
  //   const headers = {'Content-type':'application/json'}
  //   const crossOriginIsolated = {withCredentials: true}
  //   const data = {

  //   }
  //   axios.get(url, {'Content-type':'application/json'}, {})
  //   .then(response => console.log(response,crossOriginIsolated))
  //   .catch(err => console.log(`Error Occured : ${err}`))
  // },

  // getPartyList: async function() {

  //   await axios.get('http://localhost:8081/partyInfoes', {
  //   //await axios.get('http://localhost:8081/partyInfos/selectSomething', data, {
  //   withCredentials: true,
  //   headers: {
  //          "Access-Control-Allow-Origin": "*",
  //          "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
  //          "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
  //        }
  //      }).then(resposne => {
  //       return resposne.data._embedded;
  //      }).catch(err => {
  //        console.log(err.response);
  //      });
  //     }
}

export default AjaxUtils
