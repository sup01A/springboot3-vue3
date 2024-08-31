import axios from "axios";
import { ElMessage } from 'element-plus'
import {useTokenStore} from "@/stores/token.js";
import router from "@/route/index.js";
const baseURL = '/api';
const instance = axios.create({baseURL});
//响应拦截器
instance.interceptors.response.use(
    result=> {
        //业务成功状态码为0，代表本次操作成功
        if (result.data.code === 0){
            return result.data
        }
        //代码走到这里，状态码不为0,代表操作失败
        //采用elmessage
        ElMessage.error(result.data.message || '服务异常1')
        // alert(result.data.message || '服务异常')

        return Promise.reject(result.data);
    },
    error => {
        if (error.response.status === 401){
            ElMessage.error('请先登录')
            router.push('/login')
        }else {
            ElMessage.error('服务异常2')
        }
        // alert('服务异常');
        return Promise.reject(error);
    }
)
//请求拦截器
instance.interceptors.request.use(
    (config)=>{
        let tokenStore = useTokenStore();
        if (tokenStore.token){
            config.headers.Authorization=tokenStore.token
        }
        return config
    },
    (err)=>{
        return  Promise.reject(err)
    }
)
export default instance;