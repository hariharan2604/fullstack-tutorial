require('dotenv').config();
const express = require('express');
const router = express.Router();
const mysql=require("mysql");

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.USER,
  password:process.env.PASSWORD,
  database:process.env.DB
});
connection.connect((err, result) => {
  if (err) throw err;
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{notfound:""});
});

router.post("/login",(req,res,next)=>{
  const usr = req.body.usr;
  const pwd = req.body.pwd;
  let sql = "SELECT * FROM login WHERE username=?";
  connection.query(sql, usr, (err, result) => {
    if (result.length > 0) {
      console.log(result);
      const id=result[0].eid;
      console.log("id:"
          +id);
      if (result[0].password === pwd) {
          if (result[0].type==="Standard"){
             let sql = "SELECT * FROM users where id=?";
             connection.query(sql,id, (err, result) => {
               res.render('user',{item:result[0]});
             });
          }
          else if (result[0].type==="Admin"){
              let sql = "select * from users where id in (select eid from login where type=\"Standard\" or eid=id);";
              connection.query(sql, (err, result) => {
                res.render('admin',{items:result});
              });
          }
      } else{
        res.render('index',{notfound:"Incorrect Username or password"});
      }
    } else {
      res.render('index',{notfound:"Incorrect Username or password"});
    }
  });
});

router.post("/filter-branch",(req,res,next)=>{
  const branch = req.body.branch;
  console.log(req.body.data);
  if (branch==="All"){
    let sql="SELECT * FROM USERS";
    connection.query(sql, branch, (err, result) => {
    if (result.length>0)
      res.render('admin',{items:result});
    else
      res.render('empty');
  });
  }

  let sql = "SELECT * FROM users WHERE branch=?";
  connection.query(sql, branch, (err, result) => {
    if (result.length>0)
      res.render('admin',{ items:result });
    else
      res.render('empty');
  });
});

router.post("/register",(req,res,next)=>{
  console.log(req.body);
  console.log("Connected");
  let sql="SELECT * FROM USERS WHERE ID=?";
  connection.query(sql,req.body.eid,(err,result)=>{
    console.log(result[0]);

    if (result.length>0){
      res.render('index',{notfound:"User already Exists please login.."})
    }
    else{
      const id = req.body.eid;
  const name = req.body.usrname;
  const mobile = req.body.mobile;
  const age = req.body.age;
  const email = req.body.email;
  const gender = req.body.gender;
  const designation = req.body.designation;
  const mstatus = req.body.mstatus;
  const branch = req.body.branch;
  sql = "INSERT INTO USERS VALUES(?,?,?,?,?,?,?,?,?)";
  connection.query(
    sql,
    [id, name, mobile, age, gender, email, designation, mstatus, branch],
    (err, result) => {
      if (err) throw err;
    }
  );
  let credentials = "INSERT INTO LOGIN VALUES(?,?,?,?)";
  connection.query(
    credentials,
    [req.body.eid, req.body.loginid, req.body.password,req.body.type],
    (err, result) => {
      if (err) throw err;
      console.log(result.affectedRows);
    }
  );
  res.redirect("/");
    }
  });

});

router.get("/delete/:id",(req,res,next)=>{
  const id = req.params.id;
  let sql = "DELETE FROM LOGIN WHERE EID=?";
  connection.query(sql, [id], (err, result) => {
    if (err) throw err;
  });
  sql = "DELETE FROM USERS WHERE ID=?";
  connection.query(sql, [id], (err, result) => {
    if (err) throw err;
    let sql = "SELECT * FROM users";
    connection.query(sql, (err, result) => {
      if (result.length>0)
        res.render('admin',{items:result});
      else
        res.render('empty');
      });
  });
});

router.get("/update/:flag?/:id",(req,res,next)=>{
    if (req.params.flag==="u"){
      let sql = "SELECT * FROM users where id=?";
      connection.query(sql,req.params.id, (err, result) => {
        // console.log(result);
        res.render('update',{item:result[0],userflag:"u"});
      });
    }
    else{
      let sql = "SELECT * FROM users where id=?";
      connection.query(sql,req.params.id, (err, result) => {
        // console.log(result);
        res.render('update',{item:result[0],userflag:"a"});
      });
    }
});

router.post("/update/:flag?/:id",(req,res,next)=>{
  const name = req.body.usrname;
  const mobile = req.body.mobile;
  const age = req.body.age;
  const email = req.body.email;
  const gender = req.body.gender;
  const designation = req.body.designation;
  const mstatus = req.body.mstatus;
  const branch = req.body.branch;
  let sql =
    "UPDATE USERS SET NAME=?,MOBILE=?,AGE=?,GENDER=?,EMAIL=?,DESIGNATION=?,MARITALSTATUS=?,BRANCH=? WHERE ID=?";
  connection.query(
    sql,
    [
      name,
      mobile,
      age,
      gender,
      email,
      designation,
      mstatus,
      branch,
      req.params.id,
    ],
    (err, result) => {
      if (err) throw err;
      if (req.params.flag==='u') {
        let sql = "SELECT * FROM users where id=?";
        connection.query(sql, req.params.id, (err, result) => {
          res.render('user', {item: result[0]});
        });
      }
      else{
        let sql = "SELECT * FROM users";
        connection.query(sql, (err, result) => {
          res.render('admin', {items: result});
        });
      }
    }
  );
});



module.exports = router;
