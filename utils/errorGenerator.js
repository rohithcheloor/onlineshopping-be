const errorMessages = [
    {
        collection:'user',
        code:11000,
        message:'A user account already exists with the same Username / Email / Phone'
    }
]
const errorGenerator = (errorCode, collection) => {
    const returnMessage = errorMessages.find((item)=>item.collection === collection && item.code === errorCode).message
    if(returnMessage){
        return returnMessage
    }
    else{
        return  "User account creation failed!"
    }
}

module.exports = errorGenerator