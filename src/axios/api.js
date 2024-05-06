import axios from 'axios';
import store from '@/store';
import GF from '@/utils/GlobalFunctions';

export const API_URL = `${import.meta.env.VITE_API_URL}/`; // Replace with your actual API base URL
export const TOKEN   = 'hr0|5StV10{£&4I>5dEw7]X$]hIq>AKMr0@y)]:£XQaf1cxSUz';

const axiosInstance = axios.create({
  timeout: 15000,
  baseURL: API_URL,
  headers: {
    // 'Content-Type': 'application/json',
    // 'Accept': 'application/json, text/javascript, */*; q=0.01',
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8n',
    // 'Authorization': `Bearer ${TOKEN}`,
    // 'Access-Control-Allow-Origin' : '*',
    // Add any other headers as needed
  },
});

// Add an interceptor for handling token or other headers

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any logic before sending the request
    // For example, you can attach a token to the headers here
    
	return config;
  },
  (error) => {
    // GF.customToast(1, `${store.getters.translate(error.message) ? store.getters.translate(error.message) : error.message}`)
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Add any logic for handling the response
    console.log(response.data)
    if (response.data.status && response.data.status === -8) {
      GF.customToast(-1, store.getters['languageStore/translate']('Please login again!'));
      var s = setTimeout(() => {
        store.commit('userStore/logout');
        clearTimeout(s)
      }, 1000)
    }
    return response;
  },
  (error) => {
    // Add any logic for handling errors

    if (error.config.url === 'validatetoken') {
      GF.customToast(-1, store.getters['languageStore/translate']('Please login again!'))
      var s = setTimeout(() => {
        store.commit('userStore/logout');
        clearTimeout(s)
      }, 1000)
    } 

    return Promise.reject(error);
  }
);

export const api = {
  // AUTH
  // login           : (data, token)  => axiosInstance.post('login', data, {headers: {Authorization: `Bearer ${token}`}}),
  login           : (data, token) => axiosInstance.post('login', data),
  logout          : (data, token) => axiosInstance.post('logout', data, {headers: {Authorization: `Bearer ${token}`}}),
  register        : (data)        => axiosInstance.post('register', data),
  checkToken      : (data)        => axiosInstance.post('validatetoken', data),
  
  // USER
  agentDetails    : (data)        => axiosInstance.post('agentdetails', data),
  myRevenue       : (data)        => axiosInstance.post('myrevenue', data),
  saveUserDetails : (data)        => axiosInstance.post('updateagent', data),
  
  // AGENTS
  agentList       : (data)        => axiosInstance.post('agentlist', data),
  createAgent     : (data)        => axiosInstance.post('createagent', data),
  
  // USERS
  userList        : (data)        => axiosInstance.post('userlist', data),

  // HISTORY
  creditHIstoryList   : (data)        => axiosInstance.post('cashflow', data),
  recordHistoryList   : (data)        => axiosInstance.post('recordlist', data),
  betRecord           : (data)        => axiosInstance.post('betrecord', data),

  // REVENUE
  getMyRevenueList    : (data)        => axiosInstance.post('myrevenue', data),
  getAgentRevenueList : (data)        => axiosInstance.post('agentrevenue', data),
  getByGameRevenueList: (data)        => axiosInstance.post('agentrevenuegames', data),

  // BALANCE
  addCash             : (data)        => axiosInstance.post('addcash', data),
  deductCash          : (data)        => axiosInstance.post('deductcash', data),
  
  // SETTINGS
  myCasinoLsit        : (data)        => axiosInstance.post('mycasinolist', data),
  updateCasinoSettings: (data)    => axiosInstance.post('updatecasinosettings', data),
  
  
};
