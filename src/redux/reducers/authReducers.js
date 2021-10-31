const INITIAL_STATE = {
    user_id: 0,
    username: "",
    password: "",
    role: "",
    isLogin: false
}

export const authReducers = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "LOGIN":
            let stateBaru = state
            stateBaru = { ...state, ...action.payload, isLogin: true }
            return stateBaru
        case "LOGOUT":
            return INITIAL_STATE
        default:
            return state;
    }
}