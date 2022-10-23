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
    async signup(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.signup();
    }

    async requestFriend(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.requestFriend();
    }

    async acceptFriend(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.acceptFriend();
    }

    async deleteFriend(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.deleteFriend();
    }

    async friendList(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.friendList();
    }

    async blockList(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.blockList();
    }

    async block(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.blockFriend();
    }

    async deleteBlock(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.deleteBlock();
    }
}

module.exports = {FriendController}