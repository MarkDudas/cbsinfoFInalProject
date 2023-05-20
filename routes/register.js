const express = require('express');
const router = express.Router(); 
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Joi = require('joi');
const bcrypt = require('bcrypt');

/* GET register page. */
router.get('/register', async function(req, res, next) {
    var students = await prisma.User.findMany();
  
    res.render('register', { title: 'Express', students: students });
});

/* POST register page. */
router.post('/register', async function(req, res, next) {
    const { email, username, password, usertype } = req.body;
  
    // Password policy validation
    const { error } = passwordPolicy.validate({ password });
    if (error) {
      return res.render('register', { title: 'Register', message: error.details[0].message });
    }
  
    try { 
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt

      const user = await prisma.user.create({
        data: {
          email, 
          username, 
          password: hashedPassword, // Store the hashed password in the database
          usertype
        },
      });
      
      res.redirect('/register');
    } catch (error) {
      if (error.code === 'P2002') {
        res.status(400).render('register', { title: 'Register', message: 'Email already exists.' });
      } else {
        console.error(error);
        res.status(500).render('register', { title: 'Register', message: 'Something went wrong. Please try again later.' });
      }
    }
});

// Password policy setting
const passwordPolicy = Joi.object({
    password: Joi.string()
      .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
        'any.required': 'Password is required'
      })
});

module.exports = router;
