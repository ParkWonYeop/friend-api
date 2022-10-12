const {FriendService} = require(`../services/FriendService`);

class FriendController{
    #request;
    #response;
    
    //생성자
    constructor(request,response){
        this.#request = request;
        this.#response = response;
    }

    //유저정보 요청
    async addUserData(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.addUserData();
    }

    async requestFriend(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.requestFriend();
    }
}

module.exports = {FriendController}