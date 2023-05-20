var express = require('express');
var router = express.Router();
const session = require('express-session');
const {PrismaClient}= require("@prisma/client")
var prisma= new PrismaClient
const bcrypt = require('bcrypt');

// Initialize the session middleware
router.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));


/* GET home page. */
router.get('/login', async function(req, res, next) {
    // If user is already logged in, redirect to appropriate page
    if (req.session.user) {
      switch (req.session.user.usertype) {
        case "admin":
          res.redirect("/admin");
          break;
        case "manager":
          res.redirect("/manager");
          break;
        case "user":
          res.redirect("/users");
          break;
        default:
          res.status(400).send("Invalid userType");
      }
      return;
    }
  
    // Otherwise, render the login page
    res.render('login', { title: 'Login' });
});
 
router.post('/login', async function(req, res, next){
    const { email, password } = req.body;
    try {
        const user = await prisma.User.findUnique({
          where: { email: email }
        });

        const passwordMatch = await bcrypt.compare(password, user.password); // Compare the inputted password with the stored hashed password

    
      if (passwordMatch) {
        
      // Save user data in session
      req.session.user = user;
      
        switch (user.usertype) {
            case "admin":
              res.redirect("/admin");
              break;  
            case "manager":
              res.redirect("/manager");
              break; 
              case "user":
                res.redirect("/users");
                break; 
            default:
                res.status(400).send("Invalid userType");
          }
        } else {
            res.render('login', { errorMessage: 'Invalid username or password' });
        }
      


    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong");
      }


});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
  req.session.destroy(err => {
    if (err) {
      console.error(err)
    } else {
      res.redirect('/login')
    }
  })
});


module.exports = router;
