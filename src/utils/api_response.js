class apiRes {
    constructor(res, statusCode = 200,message = "successfull", data){
        return res.status(statusCode).json({
            message,
            data,
            success : true
        })
    }
}

export default apiRes