const {MainDao} = require(`../Dao/mainDao`);
const {FriendDto} = require(`../Dto/friendDto`);
const {UserDto} = require(`../Dto/userDto`)
const logger = require(`../config/winston`);
const {friendStatus,errorCode} = require(`../config/etcConfig`);

class FriendService{
    #request;
    #response;

    //생성자
    constructor(request,response){
        this.#request = request;
        this.#response = response;
    }

    async requestFriend(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);
        
        try{
            const status = await mainDao.checkFriendRequest(friendDto);

            if(status = friendStatus.accept){
                logger.info('requestFriend success');
                return this.#response.send("you are already friends");
            }
            if(status = friendStatus.request){
                await mainDao.acceptFriend(friendDto);
                logger.info('requestFriend checkFriend success');
                return this.#response.send("success");
            }

            await mainDao.requestFriend(friendDto);
            mainDao.disconnectDatabase();

            logger.info('requestFriend success');
            return this.#response.send("success");
        }
        catch(error){
            if(error === errorCode.dbError){
                logger.error('requestFriend dbError');
                return this.#response.sendStatus(500);
            }
            if(error === errorCode.noResult){
                logger.error("requesterFriend noResult");
                return this.#response.sendStatus(500);
            }
        }
    }

    async acceptFriend(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);

        try{
            await mainDao.acceptFriend(friendDto);
            logger.info("acceptFreind success");
            return this.#response.send("success");
        }
        catch(error){
            if (error === errorCode.dbError){
                logger.error("acceptFriend dbError");
                return this.#response.sendStatus(500);
            }
        }   
    }

    async deleteFriend(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);

        try{
            await mainDao.deleteFriend(friendDto);

            logger.info("refuseFreind success");
            return this.#response.send("success");
        }
        catch(error){
            if (error === errorCode.dbError){
                logger.error("refuseFriend dbError");
                return this.#response.sendStatus(500);
            }
        }
    }

    async friendList(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.params);

        try{
            const friendListId = await mainDao.friendList(friendDto);

            const friendList = [];

            for(const friend of friendListId){
                friendDto.setRequester(friend.requester);
                friendDto.setAccepter(friend.accepter);
    
                const requester = await mainDao.getRequesterEmail(friendDto);

                const accepter = await mainDao.getAccepterEmail(friendDto);
    
                friendList.push({
                    requester : requester,
                    accepter : accepter,
                    status : friend.status,
                    created_at : friend.created_at
                })
            }

            logger.info('friendList success');
            return this.#response.send(friendList);
        }
        catch(error){
            if(error === errorCode.dbError){
                logger.error('friendList dbError');
                return this.#response.sendStatus(500);
            }
            if(error === errorCode.noResult){
                logger.error('friendList noResult');
                return this.#response.send("noResult");
            }
        }
    }

    async blockFriend(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);

        try{
            await mainDao.checkBlock(friendDto);

            const friend = await mainDao.checkFriendRequest(friendDto);

            if(friend !== errorCode.noResult){
                await mainDao.deleteFriend(friendDto);
            }

            await mainDao.block(friendDto);

            logger.info("blockFreind success");
            return this.#response.send("success");
        }
        catch(error){
            if(error === errorCode.dbError){
                logger.error("blockFriend dbError");
                return this.#response.sendStatus(500);
            }
    
            if(error === errorCode.noError){
                logger.info("blockFriend already block");
                return this.#response.send("already block")
            }
        }
    }

    async deleteBlock(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);

        try{
            await mainDao.deleteBlock(friendDto);

            logger.info("deleteBlock success");
            return this.#response.send("success");
        }
        catch(error){
            if(error === errorCode.dbError){
                logger.error("deleteBlock dberror");
                return this.#response.sendStatus(500);
            }
            if(error === errorCode.noResult){
                logger.error("deleteBlock noResult");
                return this.#response.sendStatus(500);
            }
        }
    }

    async blockList(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.params);

        try{
            const blockListId = await mainDao.blockList(friendDto);
            const blockList = []

            for (let block of blockListId){
                friendDto.setRequester(block.requester);
                friendDto.setAccepter(block.blocked_user);
    
                const requester = await mainDao.getRequesterEmail(friendDto);
    
                const blockedUser = await mainDao.getAccepterEmail(friendDto);
    
                blockList.push({
                    requester : requester,
                    blockedUser : blockedUser,
                    created_at : block.created_at
                })
            }

            logger.info("BlockList success")
            return this.#response.send(blockList);
        }
        catch(error){
            if(error === errorCode.dbError){
                logger.error("blockList dberror");
                return this.#response.sendStatus(500);
            }
            if(error === errorCode.noResult){
                logger.error("blockList noResult");
                return this.#response.send("noResult");
            }
        }
    }
}

module.exports = {FriendService};
