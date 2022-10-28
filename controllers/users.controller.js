// controller điều khiển lấy dữ liệu từ db require nó ra
const db = require("../models/db");

const bcrypt = require("bcrypt"); // gọi khai báo mã hóa mật khẩu.
const saltRounds = 10;
let strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
); // tạo mật khẩu kí tự đặc biệt

module.exports.getAll = (req, res) => {
  // page size và current page index
  // querystring
  let { page_size, page_index } = req.query;
  console.log(page_size, page_index);
  // check nếu bọn này không tồn tại thì trả về page size bản ghi đầu tiên
  page_index = Number(page_index) || 1; //(page_index= page_index ? page_index:1)
  page_size = Number(page_size) || 5;
  let total = 0;
  // nếu tồn tại thì trả về page size và current index
  db.execute(`SELECT * FROM table_users `) // chọn  tù bảng trên sql
    .then((data) => {
      let [rows, cols] = data;
      //array detructuring
      // let rows = data[0]
      // let cols = data [1]
      total = rows.length;
      // console.log(rows.length);
      return db.execute(
        `SELECT * FROM table_users LIMIT ${page_size} OFFSET ${
          (page_index - 1) * page_size
        }`
      );
    })
    .then((data) => {
      let [rows, cols] = data;
      console.log(total);
      res.render("users", {
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

module.exports.getAllId = (req, res) => {
  let id = req.params.id;
  db.execute("SELECT * FROM table_users WHERE id = ?", [id])
    .then((data) => {
      let [rows] = data;
      res.status(200).json({
        data: rows[0],
      });
    })
    .catch((err) => console.log(err));
};

module.exports.createUsers = (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({
      message: "Invail email or password",
    });
  }

  if (!strongRegex.test(password)) {
    return res.status(500).json({
      message: "Password is not strong enough",
    });
  }
  let id = Math.floor(Math.random() * 1000000);
  password = bcrypt.hashSync(password, saltRounds); // mã hóa mật khẩu
  db.execute("SELECT * FROM table_users WHERE email = ?", [email])
    .then((data) => {
      let [rows] = data;
      console.log(data);
      // 1 mảng chứa 1 phần tử nếu tìm thấy user
      //[] nếu mảng ko tìm thấy
      if (rows.length > 0) {
        return Promise.reject("User already exist");
      } else {
        return db.execute(
          "INSERT INTO table_users VALUES(?, ?, ?, ?, ?, ?, ?,?)",
          [id, null, null, email, null, null, password, null]
        );
      }
    })
    .then((data) => {
      console.log(data);
      res.status(200).json({
        message: "Create one succesfully",
      });
    })
    .catch((err) =>
      res.status(404).json({
        message: "Err",
      })
    );

  //     db.execute("INSERT INTO table_users VALUES(?, ?, ?, ?, ?, ?)", [
  //       id,
  //       name,
  //       username,
  //       email,
  //       website,
  //       phone,
  //     ])
  //       .then((data) => {
  //         console.log(data);
  //         res.status(200).json({
  //           message: "Create one successfully",
  //         });
  //       })
  //       .catch((err) => console.log(err));
};

module.exports.updateUsers = (req, res) => {
  let { id } = req.params;
  // let id = req.params.id;
  let { name, username, website, phone } = req.body;
  db.execute(
    "UPDATE table_users SET name=?, username=?, website = ?, phone = ? WHERE id = ?",
    [name, username, website, phone, id]
  )
    .then((data) => {
      res.status(200).json({
        message: "Update one successfully",
      });
    })
    .catch((err) => console.log(err));
};

module.exports.deleteUsers = (req, res) => {
  let { id } = req.params;
  db.execute("DELETE FROM table_users WHERE id = ?", [id])
    .then((data) => {
      console.log(data);
      res.status(200).json({
        message: "Delete one successfully",
      });
    })
    .catch((err) => console.log(err));
};
