const {MainDao} = require(`../Dao/mainDao`);
const {UserDto} = require(`../Dto/userDto`)
const logger = require(`../config/winston`);
const {friendStatus,errorCode} = require(`../config/etcConfig`);

class UserService{
    #request;
    #response;

    //생성자
    constructor(request,response){
        this.#request = request;
        this.#response = response;
    }

    async login(){
        const mainDao = new MainDao();
        const userDto = new UserDto(this.#request.body);

        await mainDao.login(userDto);

        const error = await userDto.getError();

        if(error === errorCode.isDeleted){
            logger.info("login is_deleted");
            return this.#response.send("is_deleted");
        }
        if(error === errorCode.noResult){
            logger.error("login noResult");
            return this.#response.send("noResult");
        }
        if(error === errorCode.dbError){
            logger.error("login dbError");
            return this.#response.sendStatus(500);
        }

        logger.info("login success");
        return this.#response.send("success");
    }

    async signup(){
        const mainDao = new MainDao();
        const userDto = new UserDto(this.#request.body);

        await mainDao.login(userDto);

        const checkAlreadySignup = await userDto.getError();
        
        if(checkAlreadySignup === errorCode.dbError){
            logger.error("signup checkSignup dbError");
            return this.#response.sendStatus(500);
        }
        if(checkAlreadySignup !== errorCode.noResult){
            logger.error("signup already signup");
            return this.#response.send("you are already user");
        }

        await mainDao.addUser(userDto);
        
        const error = await userDto.getError();

        if(error === errorCode.dbError){
            logger.error("signup dbError");
            return this.#response.sendStatus(500);
        }

        logger.info("signup success");
        return this.#response.send("success");
    }
}

module.exports = {UserService}
