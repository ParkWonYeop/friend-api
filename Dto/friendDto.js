class FriendDto{
    #requester
    #accepter
    #status

    constructor(body){
        this.#requester = body.requester;
        this.#accepter = body.accepter;
    }

    setRequester(requester){
        this.#requester = requester;
    }

    setAccepter(accepter){
        this.#accepter = accepter;
    }

    setStatus(status){
        this.#status = status;
    }

    async getRequester(){
        return this.#requester;
    }

    async getAccepter(){
        return this.#accepter;
    }

    async getStatus(){
        return this.#status;
    }

}

module.exports = {FriendDto}