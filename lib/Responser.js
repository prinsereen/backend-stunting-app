export const success = async (res, message = 'success', result = {}, code = 200) => {
    try {
        res.status(code).json({
            status: 'success',
            message: message,
            result: result
        })
    } catch (error) {
        console.log(error)
    }
}


export const error = async (res, message = 'error', result = {}) => {
    try {
        res.status(400).json({
            status: 'error',
            message: message,
            result: result
        })
    } catch (error) {
        console.log(error)
    }
}

