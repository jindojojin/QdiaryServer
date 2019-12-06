const express = require("express");
var morgan = require("morgan");
const app = express();
var multer = require('multer');
var upload = multer();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(morgan("dev"));
app.use((req, res, next) => {
    // hỗ trợ nhận request post/get chứa cookie dạng json từ client
    res.setHeader("Access-Control-Allow-Origin", ["http://localhost:8080","https://qdiary.github.io","http://qdiary.github.io"]);
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
    res.header('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
});
var route = require("./controllers/main_controller");
route.route(app);
app.use(upload.array());
app.use("/img", express.static("images"));
app.use("/vid", express.static("videos"));
app.use("/aud", express.static("audios"));

app.listen(process.env.PORT || 9000, () => {
    console.log("Qdiary server đang hoạt động ở cổng 9000 !");
});