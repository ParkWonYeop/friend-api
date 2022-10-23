class friendDto{
    #requester
    #accepter
    #errorCode

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

    setErrorCode(errorCode){
        this.#errorCode = errorCode;
    }

    async getRequster(){
        return this.#requester;
    }

    async getAccepter(){
        return this.#accepter;
    }

    async getErrorCode(){
        return this.#errorCode;
    }
}