// controller điều khiển lấy dữ liệu từ db require nó ra
const db = require("../models/db");
const _ = require("lodash");
const bcrypt = require("bcrypt"); // gọi khai báo mã hóa mật khẩu.
const saltRounds = 10;
let strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
); // tạo mật khẩu kí tự đặc biệt

module.exports.getAllBlogs = (req, res) => {
  // page size và current page index
  // querystring
  let { page_size, page_index } = req.query;
  console.log(page_size, page_index);
  // check nếu bọn này không tồn tại thì trả về page size bản ghi đầu tiên
  page_index = Number(page_index) || 1; //(page_index= page_index ? page_index:1)
  page_size = Number(page_size) || 5;
  let total = 0;
  // nếu tồn tại thì trả về page size và current index
  db.execute(`SELECT * FROM tbl_blogs `) // chọn  tù bảng trên sql
    .then((data) => {
      let [rows, cols] = data;
      //array detructuring
      // let rows = data[0]
      // let cols = data [1]
      total = rows.length;
      // console.log(rows.length);
      return db.execute(
        `SELECT * FROM tbl_blogs LIMIT ${page_size} OFFSET ${
          (page_index - 1) * page_size
        }`
      );
    })
    .then((data) => {
      let [rows, cols] = data;
      console.log(total);
      res.render("blogs", {
        data: rows,
        total,
        page_size,
        page_index,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getAllBlogsId = (req, res) => {
  let id = req.params.id;
  db.execute("SELECT * FROM tbl_blogs WHERE id = ?", [id])
    .then((data) => {
      let [rows] = data;
      res.status(200).json({
        data: rows[0],
      });
    })
    .catch((err) => console.log(err));
};
// render ra trang user-blogs
module.exports.getBlogsByUserId = (req, res) => {
  let { id } = req.params;
  db.execute("SELECT * FROM tbl_blogs WHERE user_id = ?", [id])
    .then((data) => {
      let [rows] = data;
      let renderData = _.chunk(rows, 3);
      console.log(rows);
      res.render("user-blog", {
        data: renderData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "err",
        message: err,
      });
    });
};







module.exports.getUploadUserById =(req, res)=>{
  let id = req.params.id
  db.execute("SELECT * FROM tbl_blogs WHERE user_id", [id])
  .then((data)=>{
    let [rows]= data;
    // console.log(rows);
    res.render("upload")
  })
  .catch((err)=>console.log(err));
}

// const upload = multer().single("profile_pic")





module.exports.createBlogs = (req, res) => {
  let { title, content } = req.body;
  let { userId } = req.params;
  if (!title || !content) {
    return res.status(500).json({
      message: "Invail title or content",
    });
  }

  let id = Math.floor(Math.random() * 1000000);

  db.execute("SELECT * FROM tbl_blogs WHERE title = ?", [title])
    .then((data) => {
      let [rows] = data;
      console.log(data);
      // 1 mảng chứa 1 phần tử nếu tìm thấy user
      //[] nếu mảng ko tìm thấy
      if (rows.length > 0) {
        return Promise.reject("User already exist");
      } else {
        return db.execute(`INSERT INTO tbl_blogs VALUES(?, ?, ?, ?, ?)`, [
          id,
          title,
          content,
          null,
          userId,
        ]);
      }
    })
    .then((data) => {
      console.log(data);
      res.status(200).json({
        message: "Create one succesfully",
      });
    })
    .catch((err) =>
      res.status(200).json({
        message: " Err",
      })
    );
};

module.exports.updateBlogs = (req, res) => {
  let { id } = req.params;
  // let id = req.params.id;
  let { title, content, img } = req.body;
  db.execute("UPDATE tbl_blogs SET title=?, content=?, img = ? WHERE id = ?", [
    title,
    content,
    img,
    id,
  ])
    .then((data) => {
      res.status(200).json({
        message: "Update one successfully",
      });
    })
    .catch((err) => console.log(err));
};

module.exports.deleteBlogs = (req, res) => {
  let { id } = req.params;
  db.execute("DELETE FROM tbl_blogs WHERE id = ?", [id])
    .then((data) => {
      console.log(data);
      res.status(200).json({
        message: "Delete one successfully",
      });
    })
    .catch((err) => console.log(err));
};
