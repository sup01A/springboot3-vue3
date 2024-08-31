<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const categorys = ref([])
import {CategoryList} from "@/services/articleCategory.js";
import { ElMessage } from 'element-plus'
const articleCategoryList = async ()=>{
  let axiosResponse = await CategoryList();
  categorys.value = axiosResponse.data
}
articleCategoryList();

//控制添加分类弹窗
const dialogVisible = ref(false)
//添加分类数据模型
const categoryModel = ref({
  id: null,
  categoryName: '',
  categoryAlias: ''
})
//添加表单校验规则
const rules = {
  categoryName:[
    {required: true, message: '请输入分类', trigger: 'blur'}
  ],
  categoryAlias:[
    {required: true, message: '请输入分类别名', trigger: 'blur'}
  ]
}
//添加文章类别事件
import {addArticleCategory} from "@/services/articleCategory.js";
const addCategory = async ()=>{
  await addArticleCategory(categoryModel.value)
  ElMessage.success('添加成功')
  //添加成功，刷新数据，就是再次获取
  await articleCategoryList()
  dialogVisible.value = false
}
//定义变量，控制标题的展示
const title = ref('')
//展示编辑弹窗
const showDialog = (row)=>{
  dialogVisible.value = true;
  title.value = '编辑分类';
  categoryModel.value.categoryName = row.categoryName
  categoryModel.value.categoryAlias = row.categoryAlias
  categoryModel.value.id = row.id
}
//更新文章类别事件
import {updateArticleCategory} from "@/services/articleCategory.js";
const updateCategory = async ()=>{
  await updateArticleCategory(categoryModel.value)
  ElMessage.success('更新成功')
  //更新成功，刷新数据，就是再次获取
  await articleCategoryList()
  dialogVisible.value = false
}
//删除文章类别事件
import {delArticleCategory} from "@/services/articleCategory.js";
import { ElMessageBox } from 'element-plus'
const deleteCategory = (row)=>{
  ElMessageBox.confirm(
      '确定删除分类吗?',
      '警告',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(
      async ()=>{
        await delArticleCategory(row.id)
        ElMessage.success('删除成功')
        //删除成功，刷新数据，就是再次获取
        await articleCategoryList()
      }
  ).catch(
      ()=>{
        ElMessage.info('取消删除')
      }
  )
}
//再次点击添加分类，清空上一次添加的数据
const clearData = ()=>{
  categoryModel.value.id = null
  categoryModel.value.categoryName = ''
  categoryModel.value.categoryAlias = ''
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <div class="extra">
          <el-button type="primary" @click="dialogVisible = true;  title = '添加分类'; clearData()">添加分类</el-button>
        </div>
      </div>
    </template>
    <el-table :data="categorys" style="width: 100%">
      <el-table-column label="序号" width="100" prop="id"> </el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="上次更改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>

    <!-- 添加分类弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="title == '添加分类' ? addCategory() : updateCategory()"> 确认 </el-button>
                </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>