var jsonParser = require("body-parser").json(); // nhận json từ client
var posts_controller = require("./posts_controller");
var user_controller = require("./user_controller");
var guard = require("../models/security_model");
const baseUrl = "/api"
module.exports = {
    route: function (app) {
        // for post api
        app.get("/", (req, res) => res.send("Hello"));
        app.get(`${baseUrl}/posts`, this.verifyAuthorization, (req, res) => posts_controller.send_posts(req, res));
        app.delete(`${baseUrl}/posts`, this.verifyAuthorization, (req, res) => posts_controller.deletePost(req, res));
        app.put(`${baseUrl}/posts`, this.verifyAuthorization, (req, res) => posts_controller.updatePost(req, res));
        app.post(`${baseUrl}/posts/create`, this.verifyAuthorization, (req, res) => posts_controller.createPost(req, res));

        // for user api
        app.post(`${baseUrl}/user/login`, jsonParser, (req, res) => user_controller.login(req, res));
        app.get(`${baseUrl}/user/profile`, this.verifyAuthorization, (req, res) => user_controller.getProfile(req, res));
    },
    verifyAuthorization: function (req, res, next) {
        let token = req.headers.authorization;
        if (token == undefined || token == null) {
            res.statusCode = 401;
            res.send();
        } else {
            let user = guard.verifyUserToken(token);
            console.log("user in token: ", user);
            if (user == null || user == undefined) {
                res.statusCode = 401;
                res.send();
                return
            }
            req.user = user;
            next();
        }
    }
}