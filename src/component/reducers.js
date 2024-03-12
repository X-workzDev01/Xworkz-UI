import { combineReducers } from 'redux';
import { SET_CLIENT_TYPE, SET_SEARCH_VALUE, SET_CALL_BACK_DATE } from './actions';


const clientTypeReducer = (state = null, action) => {
    switch (action.type) {
        case SET_CLIENT_TYPE:
            return action.payload;
        default:
            return state;
    }
};

const searchValueReducer = (state = "", action) => {
    switch (action.type) {
        case SET_SEARCH_VALUE:
            return action.payload;
        default:
            return state;
    }
};

const callBackDateReducer = (state = null, action) => {
    switch (action.type) {
        case SET_CALL_BACK_DATE:
            return action.payload;
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    clientType: clientTypeReducer,
    searchValue: searchValueReducer,
    callBackDate: callBackDateReducer,
});

export default rootReducer;
