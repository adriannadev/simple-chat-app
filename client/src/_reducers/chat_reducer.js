import {
    GET_CHAT,
    AFTER_SEND_MESSAGE
} from '../_actions/types';
 

export default function(state={},action){
    switch(action.type){
        case GET_CHAT:
            return {...state, chat: action.payload }
            case AFTER_SEND_MESSAGE:
            return {...state, chat: state.chat.concat(action.payload) }
        default:
            return state;
    }
}