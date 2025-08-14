import api from "./api";

/**회원가입 API */
const signUpApi = async (body) => {
    const result = await api.post("users/sign-up", body)
    console.log(result.data)
    return result.data
}

export default signUpApi;
