const INITIAL_STATE = {
    id: 0,
    nama: "",
    harga: 0,
    stok: 0,
    gambar: "",
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