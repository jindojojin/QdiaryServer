
const fileModel = require("./file_model")
var ObjectId = require("mongodb").ObjectID;
module.exports = {
    async createPostObject(req) {
        try {
            let newPost = JSON.parse(req.body.textContent);
            // console.log("newPost ",newPost);
            newPost.userID = req.user.id;
            newPost.time = (new Date()).toLocaleString("vi");
            newPost.images = []; newPost.videos = []; newPost.audios = [];
            // console.log("file ", req.files);
            let images = (req.files != null && req.files.images != null) ? req.files.images : null;
            let videos = (req.files != null && req.files.videos != null) ? req.files.videos : null;
            let audios = (req.files != null && req.files.audios != null) ? req.files.audios : null;
            if (images != null) newPost.images = await fileModel.saveFiles("images",images, req.user.id)
            if (videos != null) newPost.videos = await fileModel.saveFiles("videos",videos, req.user.id)
            if (audios != null) newPost.audios = await fileModel.saveFiles("audios",audios, req.user.id)
            console.log(newPost.audios)
            return Promise.resolve(newPost);
        } catch (e) {
            console.log(e);
            return Promise.reject(e);
        }
    },
    addTimeStamp(posts) {
        posts.forEach((post, i) => {
            let time = new ObjectId(post._id).getTimestamp()
            console.log(time.toLocaleString("vi"));
            posts[i]['time'] = time.toLocaleString("vi");
        });
        return posts
    },
    createGetPostsQuery(req) {
        let query = {
            userID: req.user.id,
            status:{$not:{$eq:"freezed"}}
        }
        console.log("request get post query: ",req.query)
        if(req.query.includeFreezedPost=='true')
        query.status="freezed";
        return query;
    },
    createDeleteQuery(req) {
        console.log("delete request:", req.query)
        let query = {
            userID: req.user.id,
            _id: { $in: [req.query.postID, new ObjectId(req.query.postID)] }
        }
        return query;
    },
    createUpdateQuery(req) {
        let query = {
            userID: req.user.id,
            _id: { $in: [req.query.postID, new ObjectId(req.query.postID)] }
        }
        return query;
    },
    async createUpdateObject(req) {
        try {
            let updatedPost = JSON.parse(req.body.textContent);
            let images = (req.files != null && req.files.images != null) ? req.files.images : null;
            let videos = (req.files != null && req.files.videos != null) ? req.files.videos : null;
            let audios = (req.files != null && req.files.audios != null) ? req.files.audios : null;
            //nếu có thay đổi do thêm media, trường hợp bớt media chưa xử lý
            if (images != null) {
                newImages = await fileModel.saveFiles("images",images, req.user.id);
                updatedPost.images.concat(newImages);
            }
            if (videos != null){
                newVideos = await fileModel.saveFiles("videos",videos, req.user.id);
                updatedPost.videos.concat(newVideos);
            } 
            if (audios != null){
                newAudios = await fileModel.saveFiles("audios",audios, req.user.id);
                updatedPost.audios.concat(newAudios);
            } 
            return Promise.resolve(updatedPost)
        } catch (error) {
            return Promise.reject(error);
        }

    }



}