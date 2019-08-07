import {Message} from "element-ui";

export default function({$axios, redirect}){
    $axios.onError(err => {
        const {statusCode, message} = err.response.data;
        
        if(statusCode === 401 || statusCode === 403){
            Message.warning({message: "请先登录"});
            redirect("/user");
        }

        if(statusCode === 400){
            Message.warning({message});
        }
    })
}