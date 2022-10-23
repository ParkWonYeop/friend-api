const {UserService} = require(`../services/userService`);

class UserController{
    #request;
    #response;

    constructor(request,response){
        this.#request = request;
        this.#response = response;
    }

    async login(){
        const userService = new UserService(this.#request,this.#response);
        await userService.login();
    }

    async signup(){
        const userService = new UserService(this.#request,this.#response);
        await userService.signup();
    }
}

module.exports = {UserController}