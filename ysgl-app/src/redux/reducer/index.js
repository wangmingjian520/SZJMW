/**
 * Reducer 数据处理
 * 
 */
import { combineReducers } from 'redux'
import { type } from '../action';
const ebikeData = (state, action) => {
    switch (action.type) {
        case type.SWITCH_MENU:
            return {
                ...state,
                menuName:action.menuName
            };
        
        case type.ADD_USERID:
            return {
                ...state,
                userId:action.userId
            };
        default:
            return {...state};
    }
};

export default ebikeData;