var express = require('express');
var session = require('express-session');
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


/* GET home page. */
router.get('/admin', async function(req, res, next) {
    try { 
        const user = req.session.user; // Fetch the user data from session
        if (!user || user.usertype !== 'admin') {
          // If user is not logged in or not an admin, redirect to login page
          res.redirect('/login');
          return;
        }

        const users = await prisma.user.findMany()
    
         res.render('admin/admin', { title: 'Express', users: users });

      } catch (err) {
        console.error(err)
        next(err)
      }
});

/* GET edit page. */
router.post('/admin/edit', async function(req, res, next) {
    try {
      const user = req.session.user; // Fetch the user data from session
      if (!user || user.usertype !== 'admin') {
        // If user is not logged in or not an admin, redirect to login page
        res.redirect('/login');
        return;
      }
  
      const { userId } = req.body; // Retrieve the user ID from the request body
  
      // Fetch the user record from the database
      const selectedUser = await prisma.user.findUnique({
        where: { id: String(userId) } // Convert id to string
      });
  
      res.render('admin/editAdmin', {
        title: 'Edit Manager Data',
        user: selectedUser,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

/* GET edit page. */
router.post('/admin/editconfirm', async function(req, res, next) {
    try {
      const user = req.session.user; // Fetch the user data from session
      if (!user || user.usertype !== 'admin') {
        // If user is not logged in or not an admin, redirect to login page
        res.redirect('/login');
        return;
      }
  
      const { userId, email, usertype } = req.body; // Retrieve the form data
  
      // Update the user record in the database
      await prisma.user.update({
        where: { id: String(userId) }, // Convert id to string
        data: { email, usertype }
      });
      
      // Redirect to the admin page to display the updated user data
      res.redirect('/admin');
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  
  /* POST delete user record */
router.post('/admin/delete', async function(req, res, next) {
  try {
    const { userId} = req.body;
    const userUser = req.session.user;
    if (!userUser || userUser.usertype !== 'admin') {
      res.redirect('/login');
      return;
    }

   

    // Delete the User record from the database
    await prisma.user.delete({ where: { id: userId } });
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.render('admin', { title: 'User Dashboard', user: userUser, error: 'Error occurred during deletion. Please try again.' });
  }
});

module.exports = router;
