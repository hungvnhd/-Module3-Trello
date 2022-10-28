const express = require("express");
const app = express();
const bodyParser = require("body-Parser");
const ejs = require("ejs");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer")
const {
  requireAuth,
  requireAdmin,
} = require("./middlewares/auth.middlewares");
const cookieParser = require("cookie-parser");

// Import router
let useRouter = require("./routers/users.routes");
let authRoutes = require("./routers/auth.routes");
let blogRouter = require("./routers/blogs.routes");
// setup view engines

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)+ ".jpg"
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({storage })


app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);

// setup view engines

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cookieParser("bien ba bich"));

// setup router

app.get("/", requireAuth, (req, res) => {
  res.redirect("/users");
});

app.listen(3000, () => {
  console.log("server is runing on port http://127.0.0.1:3000");
});

// Users router

app.use("/users", requireAuth, useRouter);

// blogs router. (lấy sử dụng blog)
app.use("/blogs", requireAuth, blogRouter); 

// upload router. (lấy sử dụng blog)
app.get("/upload", (req,res)=>{
  res.render("upload")
});

app.post("/upload", upload.single("image"), (req,res)=>{
  console.log(req.file);
  console.log(req.body);
});


// Auth router

app.use("/auth", authRoutes);


//assets/sfkjfj.jpg
// SQL - Structured query language ( ngôn ngữ dùng để truy vấn dữ liệu từ db)
// query: truy vấn

// sheet, json (không hỗ trợ nhiều phương thức query, khó scale lên lớn...)
//--> cần một nơi lưu trữ dữ liệu tối ưu hơn, để scalable, để query hơn
//-->> My sql, Postgresal

// sql là ngôn ngữ dùng để truy vấn vào Mysql

// MySql là gì?
// là một RDBMS

// ===> Relational Database Management Systems
// hệ quản trị CSDL quan hệ
//  Dữ Liệu sẽ được lưu trữ trong CSDL dưới dạng bảng( table-entity-thực thể)

// Mỗi bảng sẽ có nhiểu bản ghi(record) được lưu vào mỗi dòng (row)

// Mỗi dòng (row) sẽ có nhiều thuộc tính (column)

// Trong dự án thực tế, chúng ta sẽ phải thiết kế một bản vẽ CSDL quan hệ

// Bản vẽ có thể có  một bản duy nhất hoặc có nhiều bản
//liên kết với nhau  bằng các mối qh ( 1-1, 1-nhiều, nhiều- nhiều)

//SQL
// - Tạo schema ( Tạo database)
// - Tạo bảng table
// - Kết nối MySQL đến project Express
// - Một số cú pháp C/R/U/D để thao tác với bảng
