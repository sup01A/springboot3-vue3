<script setup>
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import {ref} from "vue";
//文章列表模型
const articles = ref([])
//文章类别模型
const categories = ref([])
import {CategoryList} from "@/services/articleCategory.js";
const getCategoryList = async ()=>{
  let axiosResponse = await CategoryList();
  categories.value = axiosResponse.data
}
getCategoryList()
//选中搜索文章类别id
const categoryId = ref(null)
//选中搜索文章状态
const state = ref('')
//重置搜索条件
const reSetSearch = ()=>{
  categoryId.value = null
  state.value = ''
}


//分页条数据模型
const pageNum = ref(1)
const total = ref(0)
const pageSize = ref(2)
//当每夜条数发生变化，调用次函数
const onSizeChange = (size)=>{
  pageSize.value = size
  getArticlePage()
}
//当页码发生变化，调用此函数
const onCurrentChange = (num)=>{
  pageNum.value = num
  getArticlePage()
}
//获取文章列表，分页获取
import {articleList} from "@/services/article.js";
const getArticlePage = async ()=>{
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value ? categoryId.value : null,
    state: state.value ? state.value : null
  }
  let axiosResponse = await articleList(params);
  articles.value = axiosResponse.data.items
  total.value = axiosResponse.data.total
  for (let i = 0; i < articles.value.length; i++) {
    let arrayElement = articles.value[i];
    for (let j = 0; j < categories.value.length; j++) {
      if (arrayElement.categoryId === categories.value[j].id){
        arrayElement.categoryName = categories.value[j].categoryName
      }
    }
  }
}
getArticlePage()
//添加文章抽屉显示
const visibleDrawer = ref(false)
import {Plus} from '@element-plus/icons-vue'
//添加文章数据模型
const articleModel = ref({
  title:'',
  categoryId:null,
  coverImg:'',
  content:'',
  state:''
})
//上传模型规则
const rules = {
  title:[
    {required: true, message: '请输入标题', trigger: 'blur'},
    {min: 1, max: 16, message: '请输入1到16个字符', trigger: 'blur'}
  ],
  categoryId:[
    {required: true, message: '请选择分类名', trigger: 'blur'}
  ]
}
//引入pinia的store,上传文件要用jwt——token
import {useTokenStore} from "@/stores/token.js";
const tokenStore = useTokenStore()
//成功上传调用函数
const uploadSuccess = (result)=>{
  articleModel.value.coverImg = result.data
}
//导入文本编辑框组件
import {QuillEditor} from "@vueup/vue-quill";
import '@vueup/vue-quill/dist/vue-quill.snow.css'
//添加文章事件
import {addArticle} from "@/services/article.js";
import {ElMessage} from "element-plus";
const addArticlex = async (state)=>{
  articleModel.value.state = state
  let response =  await addArticle(articleModel.value)
  ElMessage.success(response.msg ? response.msg:'添加成功')
  //让抽屉不显示
  visibleDrawer.value = false
  //再次获取文章列表
  await getArticlePage()
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="extra">
          <el-button type="primary" @click="visibleDrawer = true">添加文章</el-button>
        </div>
      </div>
    </template>
    <!-- 搜索表单 -->
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select placeholder="请选择" v-model="categoryId" style="width: 150px">
          <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="state" style="width: 150px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getArticlePage()">搜索</el-button>
        <el-button @click="reSetSearch();getArticlePage()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章列表 -->
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="文章标题" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"> </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary"></el-button>
          <el-button :icon="Delete" circle plain type="danger"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[2, 3, 10, 15]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" title="添加文章" direction="rtl" size="50%">
       添加文章表单
      <el-form :model="articleModel" label-width="100px" :rules="rules">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="categoryId">
          <el-select placeholder="请选择" v-model="articleModel.categoryId">
            <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章封面">

          <!--
              auto-upload:设置是否自动上传
              action:设置服务器接口路径
              name:设置上传的文件字段名
              headers:设置上传的请求头
              on-success:设置上传成功的回调函数
           -->

          <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false"
                     action="/api/upload"
                     name="file"
                     :headers="{'Authorization':tokenStore.token}"
                     :on-success="uploadSuccess"
          >
            <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容">
          <div class="editor">
            <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html">
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addArticlex('已发布')">发布</el-button>
          <el-button type="info" @click="addArticlex('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

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

/* 抽屉样式 */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}

</style>