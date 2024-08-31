

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-persistedstate-plugin";
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.min.js'
import App from './App.vue'
import router from "@/route/index.js";
import './assets/main.scss'
const app = createApp(App);
const pinia = createPinia()
const persist = createPersistedState()
pinia.use(persist)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus,{
    locale: zhCn
})
app.use(router)
app.use(pinia)
app.mount('#app')
