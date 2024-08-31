import instance from "@/util/request.js";

export const articleList = (paramsData)=>{
    return  instance.get('/article',{params: paramsData})
}
export const addArticle = (data)=>{
    return instance.post('/article',data)
}