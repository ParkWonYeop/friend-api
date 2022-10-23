const express = require('express');
const {UserController} = require(`../controllers/userController`)
const userRouter = express.Router();

userRouter.post('/login',function(request,response){
    const userController = new UserController(request,response);
    userController.login();
});

userRouter.post('/signup',function(request,response){
    const userController = new UserController(request,response);
    userController.signup();
});


module.exports = userRouter;