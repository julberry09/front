import { parseJwt, setAuthHeader, localStorageHandler} from 'utils';
import {ACCESS_TOKEN, JWT_EXPIRY_TIME, REFRESH_TOKEN} from './constants';
import {setUserInfo} from "../store/reducers/userInfo";
import {useDispatch} from "react-redux";
import {authRefresh} from "api/user";

// export const login =({userEmail, password})=>{
//   //const response = api.login({userId, password});
//   //{accessToken, refreshToken} = response.data
//   console.log("userEmail : ", userEmail, " password : ", password);
//   // {
//   //   "userId": "0",
//   //   "email": "test@test.com",
//   //   "name": "홍길동",
//   //   "userType" : "ADMIN",
//   //   "driverYn" : "Y",
//   //   "iat": 1662517190,
//   //   "exp" : 1664504390
//   // }
//
//   const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwibmFtZSI6Iu2Zjeq4uOuPmSIsInVzZXJUeXBlIjoiQURNSU4iLCJkcml2ZXJZbiI6IlkiLCJpYXQiOjE2NjI1MTcxOTAsImV4cCI6MTY2NDUwNDM5MH0.IcM84xuHdrOFqxW_tcSEt583Unxno7WEYKA-eTPpADE"
//   // {
//   //   "userId": "0",
//   //   "iat": 1662517190,
//   //   "exp" : 1664504390
//   // }
//   const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwIiwiaWF0IjoxNjYyNTE3MTkwLCJleHAiOjE2NjQ1MDQzOTB9.v0vEl_lXesPWzSKM9X4g4wz4mxPcn4emAXK8GnxsUdM"
//   setAuthHeader(`Bearer ${accessToken}`);
//   localStorageHandler.setItem(ACCESS_TOKEN, accessToken);
//   localStorageHandler.setItem(REFRESH_TOKEN, refreshToken);
//   //parseJwt한 부분은 redux에 저장
//   console.log("userInfo:", parseJwt(accessToken));
// }

export const initialize = () => {
  const accessToken = localStorageHandler.getItem(ACCESS_TOKEN);
  if (!accessToken) return logOut();

  // 새로고침 시 default header 초기화 방어 코드
  setAuthHeader(`Bearer ${accessToken}`);
};

export const logOut=()=>{
  setAuthHeader('');
  localStorageHandler.removeItem(ACCESS_TOKEN);
  localStorageHandler.removeItem(REFRESH_TOKEN);
  if (!location.hash) {
    location.hash = '#reload';
    location.href = location.href;
  }
}

export const onSlientRefresh = async ()=>{
  const refreshToken = localStorageHandler.getItem(REFRESH_TOKEN);
  const token = await authRefresh({refreshToken: 'Bearer ' + refreshToken});

  localStorageHandler.setItem(ACCESS_TOKEN , token);
  setTimeout(onSlientRefresh, JWT_EXPIRY_TIME - 60 * 1000);
}