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

module.exports = {UserData,Request: Request}