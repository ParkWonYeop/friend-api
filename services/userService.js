const {MainDao} = require(`../Dao/mainDao`);
const {UserDto} = require(`../Dto/userDto`)
const logger = require(`../config/winston`);
const {errorCode} = require(`../config/etcConfig`);

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

        try{
            const isDeleted = await mainDao.login(userDto)

            if(isDeleted === errorCode.isDeleted){
                logger.info("login is_deleted");
                return this.#response.send("is_deleted");
            }

            logger.info("login success");
            return this.#response.send("success");
        }
        catch(error){
            if(error === errorCode.noResult){
                logger.error("login noResult");
                return this.#response.send("noResult");
            }
            if(error === errorCode.dbError){
                logger.error("login dbError");
                return this.#response.sendStatus(500);
            }
        }
    }

    async signup(){
        const mainDao = new MainDao();
        const userDto = new UserDto(this.#request.body);
        
        try{
            await mainDao.checkAlreadySignup(userDto)
            await mainDao.addUser(userDto)

            logger.info("signup success");
            return this.#response.send("success");
        }
        catch(error){
            if(error === errorCode.dbError){
                logger.error("signup dbError");
                return this.#response.sendStatus(500);
            }
            if(error !== errorCode.noResult){
                logger.error("signup already signup");
                return this.#response.send("you are already user")
            }
        }       
    }
}

module.exports = {UserService}
