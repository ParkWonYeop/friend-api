const {MainDao} = require(`../Dao/mainDao`);
const mainDto = require(`../Dto/mainDto`)
const logger = require(`../config/winston`);
const {friendStatus,errorCode} = require(`../config/etcConfig`);
const { check } = require("prettier");

class FriendService{
    #request;
    #response;

    //생성자
    constructor(request,response){
        this.#request = request;
        this.#response = response;
    }

    async addUserData(){
        const userEmail = this.#request.body.userEmail;
        const userName = this.#request.body.userName;
        const userAge = this.#request.body.userAge;
        const userGender = this.#request.body.userGender;
        const userPhoneNumber = this.#request.body.userPhoneNumber

        const userData = new mainDto.UserData(userEmail, userName, userAge, userGender, userPhoneNumber);
        const mainDao = new MainDao();

        const getUserData = await userData.getUserData();

        const error = await mainDao.addUserData(getUserData);
        mainDao.disconnectDatabase();

        if(error === errorCode.dbError){
            logger.error('addUserData dbError');
            return this.#response.sendStatus(500);
        }

        logger.info('addUserData success');
        return this.#response.send("success")
    }

    async requestFriend(){
        const requesterEmail = this.#request.body.requesterEmail;
        const responserEmail = this.#request.body.responserEmail;

        const mainDao = new MainDao();

        const requesterIdx = await mainDao.getUserIdx({userEmail : requesterEmail});
        const responserIdx = await mainDao.getUserIdx({userEmail : responserEmail});

        const requestData = new mainDto.Request(requesterIdx,responserIdx, friendStatus.request);
        
        const getRequestData = await requestData.getRequestInformation();

        const checkFriendRequest = await mainDao.checkFriendRequest(getRequestData);
        if(checkFriendRequest === errorCode.dbError){
            logger.error('requestFriend checkFriendRequest dbError');
            return this.#response.sendStatus(500);
        }

        if(checkFriendRequest === friendStatus.accept){
            logger.info('requestFriend success');
            return this.#response.send("you are already friends");
        }

        if(checkFriendRequest !== errorCode.noResult){
            requestData.setStatus(friendStatus.accept);
            requestData.setIdx(responserIdx,requesterIdx)
            const error = await mainDao.acceptFriend(getRequestData);
            if(error === errorCode.dbError){
                logger.error('requestFriend dbError');
                return this.#response.sendStatus(500);
            }
            logger.info('requestFriend checkFriend success');
            return this.#response.send("success");
        }

        const error = await mainDao.requestFriend(getRequestData);

        mainDao.disconnectDatabase();

        if(error === errorCode.dbError){
            logger.error('requestFriend dbError');
            return this.#response.sendStatus(500);
        }

        logger.info('requestFriend success');
        return this.#response.send("success");
    }

    async acceptFriend(){
        
    }
}

module.exports = {FriendService};
