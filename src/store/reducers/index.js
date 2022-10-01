// third-party
import { combineReducers } from 'redux';

// project import
import menu     from './menu';
import userInfo from './userInfo';

import { persistReducer } from "redux-persist"; // load
import storageSession from "redux-persist/lib/storage/session"; //storageSession,
import storageLocal   from 'redux-persist/lib/storage';

// ==============================|| COMBINE REDUCERS ||============================== //
const persistConfig = {
  key: "root",
  storage: storageLocal,
  whitelist: ["userInfo"],
  // blacklist
};
export const reducers = combineReducers({ menu, userInfo });

export default persistReducer(persistConfig, reducers);
