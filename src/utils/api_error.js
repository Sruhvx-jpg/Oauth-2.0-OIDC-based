class apiError extends Error {
    constructor(statusCode, message, error = []){
        super(message)
        this.success = false
        this.statusCode = statusCode
        this.message = message
        this.error = error
        Error.captureStackTrace(this, this.constructor)
    }

    static EPE(message = "Endpoint fetching error"){
    return new apiError(404, message)
} 
}

export default apiError