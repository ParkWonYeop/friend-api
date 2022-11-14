const {MainDao} = require(`../Dao/mainDao`);
const {UserDto} = require(`../Dto/userDto`)
const logger = require(`../config/winston`);
const {errorCode} = require(`../config/etcConfig`);

class UserService{
    #request;
    #response;
    #mainDao;

    //생성자
    constructor(request,response){
        this.#request = request;
        this.#response = response;
        this.#mainDao = new MainDao();
    }

    async login(){
        const userDto = new UserDto(this.#request.body);

        try{
            const isDeleted = await this.#mainDao.login(userDto)

            if(isDeleted === errorCode.isDeleted){
                return "Is deleted";
            }

            return "Success";
        }
        catch(error){
            if(error === errorCode.noResult){
                throw "NoResult";
            }
            if(error === errorCode.dbError){
                throw "DatabaseError";
            }
        }
    }

    async signup(){
        const userDto = new UserDto(this.#request.body);
        
        try{
            await this.#mainDao.checkAlreadySignup(userDto)
            await this.#mainDao.addUser(userDto)

            return "Success";
        }
        catch(error){
            if(error === errorCode.dbError){
                throw "DatabaseError";
            }
            if(error !== errorCode.noResult){
                throw "You are already user";
            }
        }       
    }
}

module.exports = {UserService}
