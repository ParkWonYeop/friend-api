const express = require('express');
const {FriendController} = require(`../controllers/friendController`)
const friendRouter = express.Router();

friendRouter.get('/:email',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.referenceFriendList();
});

friendRouter.get('/block/:email',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.referenceBlockList();
});

friendRouter.post('/block',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.blockFriend();
});

friendRouter.post('/signup',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.addUserData();
});

friendRouter.post('/',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.requestFriend();
});

friendRouter.put('/',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.acceptFriend();
});

friendRouter.delete('/',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.refuseFriend();
});

friendRouter.delete('/block',function(request,response){
    const friendController = new FriendController(request,response);
    friendController.deleteBlock();
});

module.exports = friendRouter;
