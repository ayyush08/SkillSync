
export interface ApiErrorTypes {
    statusCode: number;
    message: string | undefined;
    errors: string[];
    stack?: string;
}


export interface ApiResponseTypes {
    statusCode: number;
    data: any | null;
    message: string;
    success: boolean;
}