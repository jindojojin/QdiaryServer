const database = require("../models/database_model")
const userModel = require("../models/user_model")
const secure = require("../models/security_model");
module.exports = {
    login: function (req, res) {
        let user = { gmail: req.body.U3, name: req.body.ig, avatar: req.body.Paa, secure_hash: req.body.Eea }
        database.getMany("user", { gmail: user.gmail })
            .then(r => {
                if (r.length == 0) {
                    console.log("user chưa tồn tại");
                    let newUser = userModel.addBasicInfo(user);
                    database.insert("user", newUser).then(r => {
                        let x = secure.createUserToken({
                            gmail: newUser.gmail,
                            name: newUser.name,
                            id: r
                        });
                        delete newUser['secure_hash'];
                        newUser.token = x;
                        user = newUser;
                    }).catch(e => { throw new Error() });
                } else {
                    console.log("user đã tồn tại")
                    console.log(r[0])
                    user = r[0];
                    delete user['secure_hash'];
                    let x = secure.createUserToken({
                        gmail: user.gmail,
                        name: user.name,
                        id: user._id
                    });
                    user.token = x;
                }
                res.statusCode = 201;
                res.send(
                    JSON.stringify(user)
                );
            }).catch(e => {
                console.log(e)
                res.statusCode = 401;
                res.send();
            });

    },
    getProfile(req, res) {
        console.log("getting profile");
        database.getOne("user", req.user.id).then(r => {
            console.log("user in db",r);
            res.statusCode = 200;
            delete r['secure_hash'];
            res.send(JSON.stringify(r))
        }).catch(e => {
            console.log(e)
            res.statusCode = 401;
            res.send();
        })
    }
}