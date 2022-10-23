class UserDto{
    #email
    #name
    #age
    #gender
    #phoneNumber
    #errorCode

    constructor(body){
        this.#email = body.email;
        this.#name = body.name;
        this.#age = body.age;
        this.#gender = body.gender;
        this.#phoneNumber = body.phoneNumber;
    }

    setEmail(email){
        this.#email = email;
    }

    setName(name){
        this.#name = name;
    }

    setAge(age){
        this.#age = age;
    }

    setGender(gender){
        this.#gender = gender;
    }

    setPhoneNumber(phoneNumber){
        this.#phoneNumber = phoneNumber;
    }

    setError(errorCode){
        this.#errorCode = errorCode;
    }

    async getError(){
        return this.#errorCode;
    }

    async getEmail(){
        return this.#email;
    }

    async getName(){
        return this.#name;
    }

    async getAge(){
        return this.#age;
    }

    async getGender(){
        return this.#gender;
    }

    async getPhoneNumber(){
        return this.#phoneNumber;
    }
}

module.exports = {UserDto};