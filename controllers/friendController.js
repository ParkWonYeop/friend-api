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

    async acceptFriend(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.acceptFriend();
    }

    async refuseFriend(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.refuseFriend();
    }

    async referenceFriendList(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.referenceFriendList();
    }

    async referenceBlockList(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.referenceBlockList();
    }

    async blockFriend(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.blockFriend();
    }

    async deleteBlock(){
        const friendService = new FriendService(this.#request,this.#response);
        await friendService.deleteBlock();
    }
}

module.exports = {FriendController}