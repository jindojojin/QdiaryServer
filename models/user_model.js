module.exports={
    addBasicInfo: function(user){
        let basicUser={
            gmail:user.gmail,
            name:user.name,
            avatar:user.avatar,
            secure_hash:user.secure_hash,
            birthday:"",
            devices:[]
        }
        return basicUser
    }
}