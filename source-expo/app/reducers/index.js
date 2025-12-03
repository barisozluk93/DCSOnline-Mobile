import { combineReducers } from 'redux';
import AuthReducer from './auth';
import ApplicationReducer from './application';
import UserReducer from './user';
import DeclarationReducer from './declaration';

export default combineReducers({
  auth: AuthReducer,
  user: UserReducer,
  declaration: DeclarationReducer,
  application: ApplicationReducer,
});
