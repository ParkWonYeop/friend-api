const {MainDao} = require(`../Dao/mainDao`);
const {FriendDto} = require(`../Dto/friendDto`);
const {friendStatus,errorCode} = require(`../config/etcConfig`);

class FriendService{
    #request;
    #response;
    #mainDao;

    //생성자
    constructor(request,response){
        this.#request = request;
        this.#response = response;
        this.#mainDao = new MainDao();
    }

    async requestFriend(){
        const friendDto = new FriendDto(this.#request.body);
        
        try{
            const status = await this.#mainDao.checkFriendRequest(friendDto);

            if(status = friendStatus.accept){
                return "You are already friends";
            }
            if(status = friendStatus.request){
                await this.#mainDao.acceptFriend(friendDto);
                return "Success";
            }

            await this.#mainDao.requestFriend(friendDto);

            return "Success";
        }
        catch(error){
            if(error === errorCode.dbError){
                throw "DatabaseError";
            }
            if(error === errorCode.noResult){
                throw "NoResult";
            }
        }
    }

    async acceptFriend(){
        const friendDto = new FriendDto(this.#request.body);

        try{
            await this.#mainDao.acceptFriend(friendDto);
            return "Success";
        }
        catch(error){
            if (error === errorCode.dbError){
                throw "DatabaseError";
            }
        }   
    }

    async deleteFriend(){
        const friendDto = new FriendDto(this.#request.body);

        try{
            await this.#mainDao.deleteFriend(friendDto);

            return "Success";
        }
        catch(error){
            if (error === errorCode.dbError){
                throw "DatabaseError";
            }
        }
    }

    async friendList(){
        const friendDto = new FriendDto(this.#request.params);

        try{
            const friendListId = await this.#mainDao.friendList(friendDto);

            const friendList = [];

            for(const friend of friendListId){
                friendDto.setRequester(friend.requester);
                friendDto.setAccepter(friend.accepter);
    
                const requester = await this.#mainDao.getRequesterEmail(friendDto);

                const accepter = await this.#mainDao.getAccepterEmail(friendDto);
    
                friendList.push({
                    requester : requester,
                    accepter : accepter,
                    status : friend.status,
                    created_at : friend.created_at
                })
            }

            return friendList;
        }
        catch(error){
            if(error === errorCode.dbError){
                throw "DatabaseError";
            }
            if(error === errorCode.noResult){
                throw "NoResult";
            }
        }
    }

    async blockFriend(){
        const friendDto = new FriendDto(this.#request.body);

        try{
            await this.#mainDao.checkBlock(friendDto);

            const friend = await this.#mainDao.checkFriendRequest(friendDto);

            if(friend !== errorCode.noResult){
                await this.#mainDao.deleteFriend(friendDto);
            }

            await this.#mainDao.block(friendDto);

            return "Success";
        }
        catch(error){
            if(error === errorCode.dbError){
                throw "DatabaseError"
            }
    
            if(error === errorCode.noError){
                throw "You are already block"
            }
        }
    }

    async deleteBlock(){
        const friendDto = new FriendDto(this.#request.body);

        try{
            await this.#mainDao.deleteBlock(friendDto);

            return "Success";
        }
        catch(error){
            if(error === errorCode.dbError){
                throw "DatabaseError"
            }
            if(error === errorCode.noResult){
                throw "NoResult"
            }
        }
    }

    async blockList(){
        const friendDto = new FriendDto(this.#request.params);

        try{
            const blockListId = await this.#mainDao.blockList(friendDto);
            const blockList = []

            for (let block of blockListId){
                friendDto.setRequester(block.requester);
                friendDto.setAccepter(block.blocked_user);
    
                const requester = await this.#mainDao.getRequesterEmail(friendDto);
    
                const blockedUser = await this.#mainDao.getAccepterEmail(friendDto);
    
                blockList.push({
                    requester : requester,
                    blockedUser : blockedUser,
                    created_at : block.created_at
                })
            }

            return blockList;
        }
        catch(error){
            if(error === errorCode.dbError){
                throw "DatabaseError"
            }
            if(error === errorCode.noResult){
                throw "NoResult"
            }
        }
    }
}

module.exports = {FriendService};
