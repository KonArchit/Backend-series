class ApiError extends Error{
    constructor(
        statusCode,
        message = "Something went wrong!",
        errors = [],
        stack = "" 
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.errors = errors
        this.success = false
        this.message = message

        // backend developer stack ko trace kr ske agr koi error ya files mae dikat aae. 
        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}