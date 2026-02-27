import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import UserReducer from './user';
import DeclarationReducer from './declaration';
import declarationYYSReducer from './declarationYYS';
import dashboardReducer from './dashboard';

export default combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  dashboard: dashboardReducer,
  declaration: DeclarationReducer,
  declarationYYS: declarationYYSReducer,
  application: ApplicationReducer,
});
