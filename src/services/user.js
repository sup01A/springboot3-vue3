import instance from "@/util/request.js";
export const userRegisterService = (registerData)=>{
    const params = new URLSearchParams();
    for (let key in registerData){
        params.append(key,registerData[key]);
    }
    return instance.post("/user/register",params)
}
export const userLogin = (loginData)=>{
    const params = new URLSearchParams();
    for (let key in loginData){
        params.append(key,loginData[key]);
    }
    return instance.post("/user/login",params)
}
export const getUserInfo = ()=>{
    return instance.get('/user/userInfo')
}