<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import {useTokenStore} from "@/stores/token.js";

//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
const registerData = ref({
  username:'',
  password:'',
  rePassword:''
})
const loginData = ref({
  username:'',
  password:''
})
// 自定义规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerData.value.password) {
    callback(new Error("两次输入密码不相同"))
  } else {
    callback()
  }
}
// 定义表单校验规则
const rules = {
  username:[
    {required: true,message: '请输入用户名',trigger: 'blur'},
    {min: 5,max: 16,message: '5-16个字符' ,trigger: 'blur'}
  ],
  password:[
    {required: true,message: '请输入密码',trigger: 'blur'},
    {min: 5,max: 16,message: '5-16个字符' ,trigger: 'blur'}
  ],
  rePassword:[
    {validator: validatePass, trigger: 'blur'}
  ]
}
//注册按钮事件
import { ElMessage } from 'element-plus'
import {userRegisterService,userLogin} from "@/services/user.js";
import {useRouter} from "vue-router";
const route = useRouter()
const registerButtonEvent = async ()=>{
  let axiosResponse = await userRegisterService(registerData.value);
  ElMessage.success(axiosResponse.msg ? axiosResponse.msg : '注册成功')
  // alert(axiosResponse.msg ? axiosResponse.msg : '注册成功');
}
//登陆按钮事件
//使用pinia记录jwt_token
const tokenStore = useTokenStore()
const loginButtonEvent = async ()=>{
  let axiosResponse = await userLogin(loginData.value);
  ElMessage.success(axiosResponse.msg ? axiosResponse.msg : '登陆成功')
  tokenStore.setToken(axiosResponse.data)
  await route.push('/')
}
</script>
<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"></el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="registerButtonEvent">
            注册
          </el-button>
        </el-form-item><el-form-item class="flex">
        <el-link type="info" :underline="false" @click="isRegister = false">
          ← 返回
        </el-link>
      </el-form-item>
      </el-form>
      <!-- 登录表单 -->
      <el-form ref="form" size="large" autocomplete="off" v-else :model="loginData" :rules="rules">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="loginButtonEvent">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #ffffff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
    url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>