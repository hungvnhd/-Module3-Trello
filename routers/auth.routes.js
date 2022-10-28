// gọi ra để sử dụng
const express = require("express");
const db = require("../models/db");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/users.controller");

// define router

// "/register"==> sử dụng users.controller createUsers

// "/login" --> Tạo controller cho auth.controller với tên là login
// thực hiện tìm kiếm trong db xem có user không
// nếu không --> trả về cho ngươi dùng không tồn tại
// nêu có --> check pass
//        --> nếu đúng trả về res.json({message:Login successfully})
//       --> nếu sai trả về res.json({message: wrong password})

// router.get("/register", (req, res) => {
//     res.status(200).json({
//       message: "đây là trang đăng kí",
//     });
//   });

// router.post("/register", userController.createUsers);

// router.get("/login", (req, res) => {
//   res.status(200).json({
//     message: "đây là trang đăng nhập",
//   });
// });

// router.post("/login", (req, res) => {
//   let username = req.body.username;
//   let password = req.body.password;

//   if(username && password){
//     db.execute("SELECT * FROM table_users WHERE username = ?", [
//         username,
//       ])
//       .then((data)=>{
//         let [rows]= data;
//         console.log(rows);
//         // console.log(rows.length);
//         if(rows.length == 0){
//             res.status(500).json({
//                 message: "Không tồn tại "
//             })
//         }else{
//             // console.log(password);
//             // console.log(rowsPassword);
//             if( password == rows[0].password){
//                 res.status(200).json({
//                     message: "Login successfully", 
//                 })
//             }else{
//                 res.status(500).json({
//                     message: "wrong password"
//                 })
//             }
//         }
    
//       })
//       .catch((err)=>console.log(err))
//   }
// })

// thầy chữa 
   router.get("/register", authController.renderRegister);

  router.post("/register", userController.createUsers);
 
   router.get("/login", authController.renderLogin);

   router.post("/login", authController.login);
   
   router.get("/logout", authController.logout);





 




module.exports = router;
