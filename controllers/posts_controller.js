const secure = require("../models/security_model")
const postModel = require("../models/posts_model")
const database = require("../models/database_model")
var fs = require("fs");
module.exports = {
    send_posts: function (req, res) {
        console.log(req.query)
        let query = postModel.createGetPostsQuery(req);
        database.getMany("posts", query, parseInt(req.query.start), parseInt(req.query.limit)).then(r => {
            // let postWithTimeStamp = postModel.addTimeStamp(r)
            res.statusCode = 200;
            res.send(JSON.stringify(r))
        }).catch(e => {
            console.log(e)
            res.statusCode = 503;
            res.send();
        })

    },
    createPost: function (req, res) {
        console.log("tạo post mới");
        // console.log("img", req.files);
        postModel.createPostObject(req).then(post => {
            database.insert("posts", post).then(r => {
                res.statusCode = 201;
                res.send()
            }).catch(e => {
                res.statusCode = 503;
                res.send();
            })
        }).catch(e => {
            console.log("posts_controller.createPost ", e)
            res.statusCode = 500;
            res.send();
        })
    },
    deletePost: function (req, res) {
        console.log("xóa post");
        // console.log("img", req.files);
        let query = postModel.createDeleteQuery(req);
        database.delete("posts", query).then(r => {
            console.log("kết quả xóa db:",r)
            res.statusCode = 204;
            res.send()
        }).catch(e => {
            console.log("posts_controller.deletePost.deleteInDB ", e)
            res.statusCode = 503;
            res.send();
        })

    },
    updatePost: function (req, res) {
        console.log("update post");
        // console.log("img", req.files);
        postModel.createUpdateObject(req).then(updateObject => {
            let query = postModel.createUpdateQuery(req)
            database.update("posts", query, updateObject).then(r => {
                res.statusCode = 205;
                res.send()
            }).catch(e => {
                console.log("posts_controller.updatePost.updateInDB ", e)
                res.statusCode = 503;
                res.send();
            })
        }).catch(e => {
            console.log("posts_controller.updatePost.makeUpdateObject ", e)
            res.statusCode = 500;
            res.send();
        })
    }
}