export const LoginAction = (userdata) => {
    return {
        type: "LOGIN",
        payload: userdata
    }
}

export const LogoutAction = () => {
    return {
        type: "LOGOUT"
    }
}