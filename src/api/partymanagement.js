import {axios} from 'utils';
import axiosInstance from 'utils/axiosHandler';
import stringify from 'json-stringify';

/**
 * 카풀 이동정보 검색
 * @param {{id:Long}} params
 * @returns
 */
 export const getPartyInfo = async params =>
 axiosInstance.get('/api/party-management/partyInfos/carpool-info',{params});

/**
 * 현재 참여 가능한 카풀리스트 전체 검색
 * condition : "start_date", "distance", "review_average_score", ""
 * js : SelectCarpoolList.js
 * @param {{condition:String}} params
 * @returns
 */
export const getPartyInfoAllNow = async params =>
       axiosInstance.get('/api/party-management/partyInfos/carpool-now-list',{params});

/**
*  개인 별 진행 중인 카풀 내역 검색
* js : MyCarpoolList.js
*/
export const getPartyInfoMyNow = async params =>
       axiosInstance.get('/api/party-management/partyInfos/carpool-now-my-list',{params});

/**
*  개인 별 지난 카풀 내역 검색
* js : MyCarpoolPastList.js
*/
export const getPartyInfoPastMyNow = async params =>
       axiosInstance.get('/api/party-management/partyInfos/carpool-past-my-list',{params});

/**
 * 이동정보 등록
 * 415 error -> headers application/json으로 설정필요
 * springboot에서 requestbody 못 받는 이슈가 있었는데, import 잘못해서 였음.
 * js : moveInfoRegister.js -> 대문자로 변경할 것
 */


/**
 * @param {{question:{title: text, body:text}}} data
 */
export const postMoveInfo = async data =>
    axios.post('/api/party-management/partyInfos/post-moveinfo', data);

// export const postMoveInfo = async function (Data) {
//     let url      = process.env.REACT_APP_API_SERVER + '/api/party-management/partyInfos/post-moveinfo';
//     let headers  = {  "Content-Type": 'application/json', }
//     const response = await axios.post(url,stringify(Data),{headers});
//     console.log(response);
//     return response;
// }

export const deleteMoveInfo = async params =>
       axiosInstance.delete('/api/party-management/partyInfos/delete-moveinfo',{params});

export const getDriverInfo = async params =>
    axiosInstance.get('/api/user/driver-info',{params});


/**
 * @param {{partyId: number, carpoolerId: text }} data
 */
export const requestPayment = async data =>
    axios.post('/api/party-management/partyInfos/request-pay-check', data);
/**
 * @param {{partyId: number, carpoolerId: text }} data
 */
export const checkPayment = async data =>
    axios.post('/api/party-management/partyInfos/check-payment', data);
/**
 * @param {{partyId: number, carpoolerId: text }} data
 */
export const retryPayment = async data =>
    axios.post('/api/party-management/partyInfos/retry-payment', data);

export const getWaitingPartyIdList = async (params) =>
    axios.get('/api/match/partymembers/waiting-party-list', { params });

export const getWaitingPartyList = async params =>
    axios.get('/api/party-management/partyInfos/carpool-list-with-id', {params});


