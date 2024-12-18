// src/app/rootReducer.ts
import { combineReducers } from 'redux';
import customerReducer from './slice/customerSlice';
import membershipReducer from './slice/membershipSlice';

const rootReducer = combineReducers({
    customers: customerReducer,
    memberships: membershipReducer,
});

export default rootReducer;
