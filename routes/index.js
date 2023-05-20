var express = require('express');
var session = require('express-session');
var router = express.Router();
const {PrismaClient}= require("@prisma/client")
var prisma= new PrismaClient

/* GET home page. */
router.get('/', async function(req, res, next) { 
  if (!req.session) { 
    res.redirect('/login');
    return;
  }
  else {
    var students = await prisma.student_info.findMany()
  
    res.render('index', { title: 'Express',students: students });

  }      
});


module.exports = router;
