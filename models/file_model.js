const path = require('path');
const secure = require("./security_model")
module.exports = {
    async saveFiles(typeOfFile, files, userID) {
        try {
            let fileArr = []
            if (files.length >= 1) {
                for (let i = 0; i < files.length; i++) {
                    let databasePath = await this.saveFile(typeOfFile, files[i], userID)
                    fileArr.push(databasePath);
                }
            } else {
                let databasePath = await this.saveFile(typeOfFile, files, userID)
                fileArr.push(databasePath);
            }
            return Promise.resolve(fileArr);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    async saveFile(typeOfFile, file, userID) {
        if (typeOfFile == "audios") {
            file.lastModifiedDate = new Date();
            file.name = secure.createSalt(userID);
        }
        let databasePath = userID + "__" + secure.createSalt() + secure.createSalt() + file.name;
        // // tạo đường dẫn để ghi file
        let serverPath = `/${typeOfFile}/` + databasePath;
        // console.log(databasePath, " <- databasePath");
        var newfile = path.join(__dirname, "..", serverPath);
        await file.mv(newfile);
        return databasePath;
    }

}