


export interface ApiErrorTypes {
    statusCode: number;
    message: string | undefined;
    errors: string[];
    stack?: string;
}





class ApiError extends Error implements ApiErrorTypes {
    statusCode: number;
    data: any | null;
    success: boolean;
    errors: string[];
    message: string;
    stack?: string;

    constructor(
        statusCode: number,
        message: string = 'Something went wrong',
        errors: string[] = [],
        stack: string = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        this.message = message;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
