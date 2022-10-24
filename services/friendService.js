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

        await mainDao.getRequesterIdx(friendDto);

        if(await friendDto.getRequester() === errorCode.dbError){
            logger.error("requesterFriend getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getRequester() === errorCode.noResult){
            logger.error("requesterFriend getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.getAccepterIdx(friendDto);

        if(await friendDto.getAccepter() === errorCode.dbError){
            logger.error("requesterFriend getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getAccepter() === errorCode.noResult){
            logger.error("requesterFriend getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.checkFriendRequest(friendDto);

        const status = await friendDto.getStatus()

        if(status === errorCode.dbError){
            logger.error('requestFriend checkFriendRequest dbError');
            return this.#response.sendStatus(500);
        }

        if(status === friendStatus.accept){
            logger.info('requestFriend success');
            return this.#response.send("you are already friends");
        }

        if(status !== errorCode.noResult){
            await mainDao.acceptFriend(friendDto);
            if(await friendDto.getStatus() === errorCode.dbError){
                logger.error('requestFriend dbError');
                return this.#response.sendStatus(500);
            }
            logger.info('requestFriend checkFriend success');
            return this.#response.send("success");
        }

        await mainDao.requestFriend(friendDto);

        mainDao.disconnectDatabase();

        if(await friendDto.getStatus() === errorCode.dbError){
            logger.error('requestFriend dbError');
            return this.#response.sendStatus(500);
        }

        logger.info('requestFriend success');
        return this.#response.send("success");
    }

    async acceptFriend(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);

        await mainDao.getRequesterIdx(friendDto);

        if(await friendDto.getRequester() === errorCode.dbError){
            logger.error("acceptFriend getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getRequester() === errorCode.noResult){
            logger.error("acceptFriend getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.getAccepterIdx(friendDto);

        if(await friendDto.getAccepter() === errorCode.dbError){
            logger.error("acceptFriend getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getAccepter() === errorCode.noResult){
            logger.error("acceptFriend getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.acceptFriend(friendDto);

        if (await friendDto.getStatus() === errorCode.dbError){
            logger.error("acceptFriend dbError");
            return this.#response.sendStatus(500);
        }

        logger.info("acceptFreind success");
        return this.#response.send("success");
    }

    async deleteFriend(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);

        await mainDao.getRequesterIdx(friendDto);

        if(await friendDto.getRequester() === errorCode.dbError){
            logger.error("refuseFriend getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getRequester() === errorCode.noResult){
            logger.error("refuseFriend getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.getAccepterIdx(friendDto);

        if(await friendDto.getAccepter() === errorCode.dbError){
            logger.error("refuseFriend getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getAccepter() === errorCode.noResult){
            logger.error("refuseFriend getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.deleteFriend(friendDto);

        if (await friendDto.getStatus() === errorCode.dbError){
            logger.error("refuseFriend dbError")
            return this.#response.sendStatus(500);
        }

        logger.info("refuseFreind success");
        return this.#response.send("success");
    }

    async friendList(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.params);

        await mainDao.getRequesterIdx(friendDto);

        if(await friendDto.getRequester() === errorCode.dbError){
            logger.error("friendList getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getRequester() === errorCode.noResult){
            logger.error("friendList getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.friendList(friendDto);

        const status = await friendDto.getStatus()

        if(status === errorCode.dbError){
            logger.error('friendList dbError');
            return this.#response.sendStatus(500);
        }

        if(status === errorCode.noResult){
            logger.error('friendList noResult');
            return this.#response.send("noResult");
        }

        const requseter = await friendDto.getRequester();
        const friendList = [];

        for(const friend of status){
            friendDto.setRequester(friend.requester);
            friendDto.setAccepter(friend.accepter);

            await mainDao.getRequesterEmail(friendDto);

            if(await friendDto.getRequester() === errorCode.dbError){
                logger.error("friendList getFriendIdx dberror");
                return this.#response.sendStatus(500);
            }
            if(await friendDto.getRequester() === errorCode.noResult){
                logger.error("friendList getFriendIdx noResult");
                return this.#response.sendStatus(500);
            }

            await mainDao.getAccepterEmail(friendDto);

            if(await friendDto.getAccepter() === errorCode.dbError){
                logger.error("friendList getFriendIdx dberror");
                return this.#response.sendStatus(500);
            }
            if(await friendDto.getAccepter() === errorCode.noResult){
                logger.error("friendList getFriendIdx noResult");
                return this.#response.sendStatus(500);
            }

            friendList.push({
                requester : await friendDto.getRequester(),
                accepter : await friendDto.getAccepter(),
                status : friend.status,
                created_at : friend.created_at
            })
        }

        logger.info('friendList success');
        return this.#response.send(friendList);
    }

    async blockFriend(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);

        await mainDao.getRequesterIdx(friendDto);

        if(await friendDto.getRequester() === errorCode.dbError){
            logger.error("blockFriend getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getRequester() === errorCode.noResult){
            logger.error("blockFriend getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.getAccepterIdx(friendDto);

        if(await friendDto.getAccepter() === errorCode.dbError){
            logger.error("blockFriend getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getAccepter() === errorCode.noResult){
            logger.error("blockFriend getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.checkBlock(friendDto);

        if(await friendDto.getStatus() === errorCode.dbError){
            logger.error("blockFriend checkBlockFriend dbError");
            return this.#response.sendStatus(500);
        }

        if(await friendDto.getStatus() !== errorCode.noResult){
            logger.info("blockFriend already block");
            return this.#response.send("already block")
        }

        await mainDao.checkFriendRequest(friendDto);

        const status = await friendDto.getStatus()

        if(status === errorCode.dbError){
            logger.error('blockFriend checkFriendRequest dbError');
            return this.#response.sendStatus(500);
        }

        if(status !== errorCode.noResult){
            await mainDao.deleteFriend(friendDto);
            if(await friendDto.getStatus() === errorCode.dbError){
                logger.error('blockFriend checkFriendRequest dbError');
                return this.#response.sendStatus(500);
            }
        }

        await mainDao.block(friendDto);

        if (await friendDto.getStatus()  === errorCode.dbError){
            logger.error("blockFriend dbError")
            return this.#response.sendStatus(500);
        }

        logger.info("blockFreind success");
        return this.#response.send("success");
    }

    async deleteBlock(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.body);

        await mainDao.getRequesterIdx(friendDto);

        if(await friendDto.getRequester() === errorCode.dbError){
            logger.error("deleteBlock  getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getRequester() === errorCode.noResult){
            logger.error("deleteBlock  getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.getAccepterIdx(friendDto);

        if(await friendDto.getAccepter() === errorCode.dbError){
            logger.error("deleteBlock  getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getAccepter() === errorCode.noResult){
            logger.error("deleteBlock  getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.deleteBlock(friendDto);

        if(await friendDto.getStatus() === errorCode.dbError){
            logger.error("deleteBlock dberror");
            return this.#response.sendStatus(500);
        }

        logger.info("deleteBlock success");
        return this.#response.send("success");
    }

    async blockList(){
        const mainDao = new MainDao();
        const friendDto = new FriendDto(this.#request.params);

        await mainDao.getRequesterIdx(friendDto);

        if(await friendDto.getRequester() === errorCode.dbError){
            logger.error("blockList  getFriendIdx dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getRequester() === errorCode.noResult){
            logger.error("blockList  getFriendIdx noResult");
            return this.#response.sendStatus(500);
        }

        await mainDao.blockList(friendDto);

        if(await friendDto.getStatus() === errorCode.dbError){
            logger.error("blockList dberror");
            return this.#response.sendStatus(500);
        }
        if(await friendDto.getStatus() === errorCode.noResult){
            logger.error("blockList noResult");
            return this.#response.send("noResult");
        }

        const blockListId = await friendDto.getStatus()
        const blockList = []

        for (let block of blockListId){

            friendDto.setRequester(block.requester);
            friendDto.setAccepter(block.blocked_user);

            await mainDao.getRequesterEmail(friendDto);
            const requester = await friendDto.getRequester()

            if(requester === errorCode.dbError){
                logger.error("blockList  getFriendEmail dberror");
                return this.#response.sendStatus(500);
            }
            if(requester === errorCode.noResult){
                logger.error("blockList  getFriendEmail noResult");
                return this.#response.sendStatus(500);
            }

            await mainDao.getAccepterEmail(friendDto);
            const blockedUser = await friendDto.getAccepter();

            if(blockedUser === errorCode.dbError){
                logger.error("blockList getFriendEmail dberror");
                return this.#response.sendStatus(500);
            }
            if(blockedUser === errorCode.noResult){
                logger.error("blockList getFriendEmail noResult");
                return this.#response.sendStatus(500);
            }

            blockList.push({
                requester : requester,
                blockedUser : blockedUser,
                created_at : block.created_at
            })
        }

        logger.info("BlockList success")
        return this.#response.send(blockList);
    }
}

module.exports = {FriendService};
