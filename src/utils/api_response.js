class apiRes {
    constructor(res, status = "200",message = "successfull", data){
        return res.status(status).json({
            message,
            data,
            success : true
        })
    }
}

export default apiRes