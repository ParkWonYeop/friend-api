class UserData{
    #userData

    constructor(userEmail, userName, userAge, userGender, userPhoneNumber){
        this.#userData = {
            userEmail : userEmail,
            userName : userName,
            userAge : userAge,
            userGender : userGender,
            userPhoneNumber : userPhoneNumber
        }
    }

    async getUserData(){
        return this.#userData;
    }
}

class Request{
    #requestInformation;

    constructor(requesterIdx,responserIdx,status){
        this.#requestInformation = {
            requesterIdx : requesterIdx,
            responserIdx : responserIdx,
            status : status
        }
    }

    async setStatus(status){
        this.#requestInformation.status = status
    }

    async setIdx(requestIdx,responserIdx){
        this.#requestInformation.requesterIdx = requestIdx;
        this.#requestInformation.responserIdx = responserIdx;
    }

    async getRequestInformation(){
        return this.#requestInformation;
    }
}

class FriendList{
    #friendList;

    constructor(){
        this.#friendList = []
    }

    async sortList(result,userIdx){
        for (const friend of result){
            const friendInformation = {
                user : friend.requester,
                friend : friend.responser,
                status : friend.status
            }
            if(friend.requester !== userIdx){
                if(friend.status === 0){
                    friendInformation.status = 2;
                }
                friendInformation.user = friend.responser;
                friendInformation.friend = friend.requester;
            }
            this.#friendList.push(friendInformation);
        }
    }

    async getFriendList(){
        return this.#friendList;
    }
}

class BlockList{
    #blockList;

    constructor(){
        this.#blockList = []
    }

    async sortList(result){
        for (const block of result){
            const blockInformation = {
                user : block.requester,
                blockUser : block.responser,
            }
            this.#blockList.push(blockInformation);
        }
    }

    async getBlockList(){
        return this.#blockList;
    }
}


module.exports = {
    UserData,
    Request,
    FriendList,
    BlockList
}