module.exports.requireAuth = (req, res, next) => {
 if(Object.keys(req.signedCookies).length === 0){
    res.redirect("/auth/login");
 }else{
    next();
 }
};

   module.exports.requireAdmin=(req, res, next)=>{
      let {userId}= req.signedCookies;
      if(req.signedCookies.role === "admin"){
         next();
      }else{
         res.redirect(`/users/${userId}/blogs`)
      }
   }
   // hàm middliware để kiểm tra điều kiện