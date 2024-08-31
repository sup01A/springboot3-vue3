<script setup>
import {ref} from "vue";
import {search2} from "@/services/articleCategory.js";

const articlelist = ref([])
const searchItem = ref({
    categoryId: null,
    state: ''
})
const searchArticle = async ()=>{
  console.log({...searchItem.value})
  let data = await search2({...searchItem.value})
  console.log(data)
  articlelist.value = data.data
}

</script>

<template>
<div>
  <label for="x1">文章分类</label>
  <input type="number" id="x1" v-model="searchItem.categoryId">
  <label for="x2">发布状态</label>
  <input type="text" id="x2" v-model="searchItem.state">
  <button @click="searchArticle">搜索</button>
  <br>
  <br>
  <table>
    <tr>
      <th>文章标题</th>
      <th>分类</th>
      <th>发表时间</th>
      <th>状态</th>
      <th>操作</th>
    </tr>
    <tr v-for="(item,index) in articlelist" :key="item.id">
      <td>{{item.title}}</td>
      <td>{{item.categoryId}}</td>
      <td>{{item.createTime}}</td>
      <td>{{item.state}}</td>
      <td>
        <button>编辑</button>
        <button>删除</button>
      </td>
    </tr>
  </table>
</div>
</template>

<style scoped>

</style>