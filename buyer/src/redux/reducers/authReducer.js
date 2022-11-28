import { TAB_HISTORY, USER_AUTH, TAB_HISTORY_BACK, PAGE_LOADER, SEARCH_QUERY, RESET_TAB_HISTORY, CART_COUNT } from "../action/actionType";

const initialState = {
    loading: false,
    user: '',
    userTab: ['home'],
    query: '',
    cartItems: 0

};

const changeState = (state = initialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case USER_AUTH:
            return {
                ...state,
                loading: false,
                user: payload ? { ...state.user, ...payload } : payload,
            };

        case TAB_HISTORY:
            return {
                ...state,
                userTab: payload ? [...state.userTab, ...payload] : payload,
            };
        case TAB_HISTORY_BACK:
            return {
                ...state,
                userTab: payload ? payload : state.userTab
            }
        case PAGE_LOADER:
            return {
                ...state,
                loading: payload
            }
        case SEARCH_QUERY:
            return {
                ...state,
                query: payload
            }
        case RESET_TAB_HISTORY:
            return {
                ...state,
                userTab: payload
            }
        case CART_COUNT:
            return {
                ...state,
                cartItems: payload
            }
        default:
            return state
    }
}

export default changeState;