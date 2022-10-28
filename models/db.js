const mysql = require("mysql2");
// liên kết đến database: lấy và lưu dữ liệu trên db
let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database:"users-schemas",
    password: "12345678",
});

module.exports=pool.promise();
