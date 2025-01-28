import { ApiResponseTypes } from "../types/utilTypes";


class ApiResponse implements ApiResponseTypes{
    statusCode:number;
    data:any|null;
    message:string;
    success:boolean;
    constructor(statusCode:number,data:any|null,message:string="Success"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export {ApiResponse}