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
        const requestData2 = new mainDto.Request(responserIdx,requesterIdx, friendStatus.request);

        const getRequestData = await requestData.getRequestInformation();

        const getRequestData2 = await requestData2.getRequestInformation();

        const checkFriendRequest = await mainDao.checkFriendRequest(getRequestData);

        const checkFriendRequest2 = await mainDao.checkFriendRequest(getRequestData2);


        if(checkFriendRequest === errorCode.dbError || checkFriendRequest2 === errorCode.dbError){
            logger.error('requestFriend checkFriendRequest dbError');
            return this.#response.sendStatus(500);
        }

        if(checkFriendRequest === friendStatus.accept || checkFriendRequest2 === friendStatus.accept){
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
        const requesterEmail = this.#request.body.requesterEmail;
        const responserEmail = this.#request.body.responserEmail;

        const mainDao = new MainDao();

        const requesterIdx = await mainDao.getUserIdx({userEmail : requesterEmail});
        const responserIdx = await mainDao.getUserIdx({userEmail : responserEmail});

        const requestData = new mainDto.Request(requesterIdx,responserIdx, friendStatus.accept);
        
        const getRequestData = await requestData.getRequestInformation();

        const error = await mainDao.acceptFriend(getRequestData);

        if (error === errorCode.dbError){
            logger.error("acceptFriend dbError")
            return this.#response.sendStatus(500);
        }

        logger.info("acceptFreind success");
        return this.#response.send("success");
    }

    async refuseFriend(){
        const requesterEmail = this.#request.body.requesterEmail;
        const responserEmail = this.#request.body.responserEmail;

        const mainDao = new MainDao();

        const requesterIdx = await mainDao.getUserIdx({userEmail : requesterEmail});
        const responserIdx = await mainDao.getUserIdx({userEmail : responserEmail});

        const requestData = new mainDto.Request(requesterIdx,responserIdx, friendStatus.accept);

        const getRequestData = await requestData.getRequestInformation();

        const error = await mainDao.deleteFriend(getRequestData);

        if (error === errorCode.dbError){
            logger.error("refuseFriend dbError")
            return this.#response.sendStatus(500);
        }

        logger.info("refuseFreind success");
        return this.#response.send("success");
    }

    async referenceFriendList(){
        const userEmail = this.#request.params.email;

        const mainDao = new MainDao();
        const userIdx = await mainDao.getUserIdx({userEmail : userEmail})

        if(userIdx === errorCode.noResult){
            logger.error("referenceFriendList wrong Email");
            return this.#response.send("wrong Email")
        }
        if(userIdx === errorCode.dbError){
            logger.error("referenceFriendList gerUserIdx dberror");
            return this.#response.sendStatus(500);
        }

        const idxFriendList = await mainDao.getFriendList({userIdx : userIdx});

        const friendListDto = new mainDto.FriendList();
        await friendListDto.sortList(idxFriendList,userIdx);
        const friendList = await friendListDto.getFriendList();

        console.log(friendList);

        let idx = 0;

        for (let friend of friendList){
            console.log(friend.friend)
            const friendEmail = await mainDao.getUserEmail({userIdx : friend.friend});
            if(friendEmail === errorCode.dbError){
                logger.error("referenceFriendList getFriendEmail dberror");
                return this.#response.sendStatus(500);
            }
            friendList[idx].user = userEmail;
            friendList[idx].friend = friendEmail;

            idx ++;
        }

        logger.info("referenceFriendList success")
        return this.#response.send(friendList);
    }

    async blockFriend(){
        const requesterEmail = this.#request.body.requesterEmail;
        const responserEmail = this.#request.body.responserEmail;

        const mainDao = new MainDao();

        const requesterIdx = await mainDao.getUserIdx({userEmail : requesterEmail});
        const responserIdx = await mainDao.getUserIdx({userEmail : responserEmail});

        const requestData = new mainDto.Request(requesterIdx,responserIdx, 0);
        const requestData2 = new mainDto.Request(responserIdx,requesterIdx, 0);

        const getRequestData = await requestData.getRequestInformation();
        const getRequestData2 = await requestData2.getRequestInformation();

        const checkBlockFriend = await mainDao.checkBlockFriend(getRequestData2);

        if(checkBlockFriend === errorCode.dbError){
            logger.error("blockFriend checkBlockFriend dbError");
            return this.#response.sendStatus(500);
        }

        if(checkBlockFriend !== errorCode.noResult){
            logger.info("blockFriend already block");
            return this.#response.send("already block")
        }

        const checkFriendRequest = await mainDao.checkFriendRequest(getRequestData);
        const checkFriendRequest2 = await mainDao.checkFriendRequest(getRequestData2);

        if(checkFriendRequest === errorCode.dbError || checkFriendRequest2 === errorCode.dbError){
            logger.error('blockFriend checkFriendRequest dbError');
            return this.#response.sendStatus(500);
        }

        if(checkFriendRequest !== errorCode.noResult){
            const error = await mainDao.deleteFriend(getRequestData2);
            if (error === errorCode.dbError){
                logger.error("blockFriend checkFriend dbError")
                return this.#response.sendStatus(500);
            }
        }
        if(checkFriendRequest2 !== errorCode.noResult){
            const error = await mainDao.deleteFriend(getRequestData);
            if (error === errorCode.dbError){
                logger.error("blockFriend checkFriend dbError")
                return this.#response.sendStatus(500);
            }
        }

        const error = await mainDao.blockFriend(getRequestData);

        if (error === errorCode.dbError){
            logger.error("blockFriend dbError")
            return this.#response.sendStatus(500);
        }

        logger.info("blockFreind success");
        return this.#response.send("success");
    }

    async deleteBlock(){
        const requesterEmail = this.#request.body.requesterEmail;
        const responserEmail = this.#request.body.responserEmail;

        const mainDao = new MainDao();

        const requesterIdx = await mainDao.getUserIdx({userEmail : requesterEmail});
        const responserIdx = await mainDao.getUserIdx({userEmail : responserEmail});

        const requestData = new mainDto.Request(requesterIdx,responserIdx, friendStatus.accept);

        const getRequestData = await requestData.getRequestInformation();

        const error = await mainDao.deleteBlock(getRequestData);

        if (error === errorCode.dbError){
            logger.error("deleteBlock dbError")
            return this.#response.sendStatus(500);
        }

        logger.info("deleteBlock success");
        return this.#response.send("success");
    }

    async referenceBlockList(){
        const userEmail = this.#request.params.email;

        const mainDao = new MainDao();
        const userIdx = await mainDao.getUserIdx({userEmail : userEmail})

        if(userIdx === errorCode.noResult){
            logger.error("referenceBlockList wrong Email");
            return this.#response.send("wrong Email")
        }
        if(userIdx === errorCode.dbError){
            logger.error("referenceBlockList gerUserIdx dberror");
            return this.#response.sendStatus(500);
        }

        const idxBlockList = await mainDao.getBlockList({userIdx : userIdx});

        const BlockListDto = new mainDto.BlockList();
        await BlockListDto.sortList(idxBlockList);
        const blockList = await BlockListDto.getBlockList();

        let idx = 0;

        for (let block of blockList){
            console.log(block.friend)
            const blockEmail = await mainDao.getUserEmail({userIdx : block.blockUser});
            if(blockEmail === errorCode.dbError){
                logger.error("referenceBlockList getBlockEmail dberror");
                return this.#response.sendStatus(500);
            }
            blockList[idx].user = userEmail;
            blockList[idx].blockUser = blockEmail;

            idx ++;
        }

        logger.info("referenceBlockList success")
        return this.#response.send(blockList);
    }
}

module.exports = {FriendService};
