import {
    SET_CURRENT_CHAT_ROOM,
    SET_PRIVATE_CHAT_ROOM,
    SET_USER_POSTS
} from '../actions/types';

const initialChatState = {
    currentChatRoom: null,
    isPrivateChatRoom: false,
}

// eslint-disable-next-line
export default function (state = initialChatState, action) {
    switch(action.type) {
        case SET_CURRENT_CHAT_ROOM:
            return {
                ...state,
                currentChatRoom: action.payload
            }

        case SET_PRIVATE_CHAT_ROOM:
            return {
                ...state,
                isPrivateChatRoom: action.payload
            }

        case SET_USER_POSTS:
            return {
                ...state,
                userPosts: action.payload
            }
             
        default:
             return state;
    }
}