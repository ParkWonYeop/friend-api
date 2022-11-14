const { threadId } = require("worker_threads");
const logger = require("../config/winston");
const {FriendService} = require(`../services/FriendService`);

class FriendController{
    #request;
    #response;
    #friendService
    
    //생성자
    constructor(request,response){
        this.#request = request;
        this.#response = response;
        this.#friendService = new FriendService(this.#request,this.#response)
    }
    
    async requestFriend(){
        await this.#friendService.requestFriend()
        .then((result) => {
            logger.info("requestFriend Success - " + result);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("requestFriend Error - " + error);
            this.#response.send(error);
        })
    }

    async acceptFriend(){
        await this.#friendService.acceptFriend()
        .then((result) => {
            logger.info("acceptFriend Success - " + result);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("acceptFriend Error - " + error);
            this.#response.send(error);
        })
    }

    async deleteFriend(){
        await this.#friendService.deleteFriend()
        .then((result) => {
            logger.info("deleteFriend Success - " + result);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("deleteFriend Error - " + error);
            this.#response.send(error);
        })
    }

    async friendList(){
        await this.#friendService.friendList()
        .then((result) => {
            logger.info("friendList Success - " + this.#request.params.requester);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("friendList Error - " + error);
            this.#response.send(error);
        })
    }

    async blockList(){
        await this.#friendService.blockList()
        .then((result) => {
            logger.info("blockList Success - " + this.#request.params.requester);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("blockList Error - " + error);
            this.#response.send(error);
        })
    }

    async block(){
        await this.#friendService.blockFriend()
        .then((result) => {
            logger.info("blockFriend Success - " + result);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("blockFriend Error - " + error);
            this.#response.send(error);
        })
    }

    async deleteBlock(){
        await this.#friendService.deleteBlock()
        .then((result) => {
            logger.info("deleteBlock Success - " + result);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("deleteBlock Error - " + error);
            this.#response.send(error);
        })
    }
}

module.exports = {FriendController}