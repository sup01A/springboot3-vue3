import instance from "@/util/request.js";

export const search2 = (searchItem)=>{
    return instance.get("/article/search", {params: searchItem})
}
// 列出用户的文章所有类别
export const CategoryList = ()=>{
    return instance.get("/category")
}
//用户添加文章类别
export const addArticleCategory = (data)=>{
    return instance.post("/category",data)
}
//用户更新文章类别信息
export const updateArticleCategory = (data)=>{
    return instance.put("/category",data)
}
//用户删除文章类别信息
export const delArticleCategory = (id)=>{
    return instance.delete("/category",{params:{id:id}})
}