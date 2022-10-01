// types
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId     :'',
  userName   :'',
  userTeam   :'',
  email      :'',
  driverYn   :'',
  userGender : '',
  userType   : '',
  userPhoto  : null,
}
const userInfo = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo(state, action){
          state.userId    = action.payload.userId;
          state.userName  = action.payload.userName;
          state.userTeam  = action.payload.userTeam;
          state.email     = action.payload.email;
          state.driverYn  = action.payload.driverYn;
          state.userGender = action.payload.userGender;
          state.userType  = action.payload.userType;
          state.userPhoto  = action.payload.userPhoto;
      },
  },

});

export default userInfo.reducer;
export const { setUserInfo } = userInfo.actions;
