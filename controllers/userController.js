const {UserService} = require(`../services/userService`);

class UserController{
    #request;
    #response;
    #userService

    constructor(request,response){
        this.#request = request;
        this.#response = response;
        this.#userService = new UserService(this.#request,this.#response);
    }

    async login(){
        await this.#userService.login()
        .then((result) => {
            logger.info("login Success - " + result);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("login Error - " + error);
            this.#response.send(error);
        })
    }

    async signup(){
        await this.#userService.signup()
        .then((result) => {
            logger.info("signup Success - " + result);
            this.#response.send(result);
        })
        .catch((error) => {
            logger.error("signup Error - " + error);
            this.#response.send(error);
        })
    }
}

module.exports = {UserController}