const db = require("../models/db");
const bcrypt = require("bcrypt");

module.exports.renderRegister = (req, res) => {
  res.render("register.ejs");
};

module.exports.register = (req, res) => {
  res.send("<h1>This is register homepage</h1>");
};

module.exports.renderLogin = (req, res) => {
  res.render("login.ejs");
};

module.exports.renderBlogs = (req, res) => {
  res.render("blogs.ejs");
};


// thầy chữa:
module.exports.login = (req, res) => {
  let { email, password } = req.body;
  // console.log(email, password);
  if (!email || !password) {
    return res.status(500).json({
      message: "Invalid email or password",
    });
  }
  db.execute("SELECT * FROM table_users WHERE email = ?", [email])
    .then((data) => {
      let [rows] = data;
      let find = rows[0];
      if (!find) {
        res.status(404).json({
          message: "User is not exist",
        });
      } else {
        // check password
        let passValid = bcrypt.compareSync(password, find.password);
        // console.log(passValid);
        if (!passValid) {
          res.status(404).json({
            message: "Wrong password",
          });
        } else {
          res.cookie("userId", find.id, { signed: true }); // kí
          res.cookie("role", find.role, { signed: true }); // kí
          res.status(200).json({
            message: "Login Successfully",
            status: "success",
          });
          // điều hướng người dùng sang trang

          // set headers
          // res.redirect // not working after set cookie
          // res.redirect not working after res.cookie (google)
        }
      }
    })
    .catch((err) => console.log(err));
};

module.exports.logout = (req, res) => {
  // clear cookie
  //res.clearCookie()
  res.clearCookie("userId");
  // logout successfully (JSON)

  // Front end take message and redirect
};

//Authentication (xác thực)
// Session ( Phiên đăng nhập)
// Cookie
//Token (JWT- Json web token, Bearer, ...)
// Au thentication with session [Cookie, JWT...] (Express JS)
