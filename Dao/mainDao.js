const mysql = require(`mysql`);
const mybatisMapper = require(`mybatis-mapper`);
const {errorCode} = require(`../config/etcConfig`);
require("dotenv").config();

class MainDao{
    #connection
    #format
    #query
    
    constructor(){
        this.#connection = mysql.createConnection({
            host: process.env.DB_HOST, // 호스트 주소
            user: process.env.DB_USER, // mysql user
            password: process.env.DB_PASS, // mysql password
            database: process.env.DB_NAME, // mysql 데이터베이스
        });
        mybatisMapper.createMapper(['./mapper/friendMapper.xml'])
        this.#format = {language : 'sql', indent: '  '}
        this.#connection.connect();
    }

    //연결해제
    disconnectDatabase(){
        this.#connection.end();
    }

    //친구목록 가져오기
    async friendList(friendDto){
        const param = {
            requester : await friendDto.getRequester()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `getFriendList`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                if(result.length === 0) {reject(errorCode.noResult);}
                resolve(result);
            })
        })
    }

    async login(userDto){
        const param = {
            userEmail:await userDto.getEmail()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `login`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                if(result.length === 0) {reject(errorCode.noResult);}
                else {resolve(result[0].is_deleted);}
            })
        })
    }

    async checkAlreadySignup(userDto){
        const param = {
            userEmail:await userDto.getEmail()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `login`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                if(result.length === 0) {resolve(errorCode.noResult);}
                else {reject(result[0].is_deleted);}
            })
        })
    }

    //차단목록 가져오기
    async blockList(friendDto){
        const param = {
            userId : await friendDto.getRequester()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `getBlockList`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                if(result.length === 0) {reject(errorCode.noResult);}
                resolve(result);
            })
        })
    }

    //유저 인덱스 가져오기
    async getRequesterIdx(friendDto){
        const param = {
            userEmail : await friendDto.getRequester()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `getUserIdx`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                if(result.length === 0) {reject(errorCode.noResult);}
                resolve(result[0].id);
            })
        })
    }

    async getAccepterIdx(friendDto){
        const param = {
            userEmail : await friendDto.getAccepter()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `getUserIdx`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                if(result.length === 0) {reject(errorCode.noResult);}
                else{resolve(result[0].id)};
            })
        })
    }

    //유저 인덱스 가져오기
    async getRequesterEmail(friendDto){
        const param = {
            userId : await friendDto.getRequester()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `getUserEmail`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                if(result.length === 0) {reject(errorCode.noResult);}
                else{resolve(result[0].email)};
            })
        })
    }

    async getAccepterEmail(friendDto){
        const param = {
            userId : await friendDto.getAccepter()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `getUserEmail`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                if(result.length === 0) {reject(errorCode.noResult);}
                else{resolve(result[0].email)};
            })
        })
    }

    async checkFriendRequest(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            accepter : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `checkFriendRequest`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError);}
                else if(result.length === 0) {reject(errorCode.noResult);}
                else {resolve(result[0].status);}
            })
        })
    }

    async checkBlock(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            blockedUser : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `checkBlock`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) {reject(errorCode.dbError)};
                if(result.length === 0) {resolve(errorCode.noResult)};
                reject(errorCode.noError);
            })
        })
    }

    //유저 데이터 추가
    async addUser(userDto){
        const param = {
            userEmail : await userDto.getEmail(),
            userName : await userDto.getName(),
            userGender : await userDto.getGender(),
            userAge : await userDto.getAge(),
            userPhoneNumber : await userDto.getPhoneNumber()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `addUserData`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error){
                if(error) {reject(errorCode.dbError)};
                resolve(errorCode.noError);
            })
        })
    }

    //친구요청
    async block(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            blockedUser : await friendDto.getAccepter()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `blockFriend`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error){
                if(error) {reject(errorCode.dbError)};
                resolve(errorCode.noError);
            })
        })
    }

    //친구요청
    async requestFriend(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            accepter : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `requestFriend`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error){
                if(error) {reject(errorCode.dbError)};
                resolve(errorCode.noError);
            })
        })
    }

    async acceptFriend(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            accepter : await friendDto.getAccepter()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `acceptFriend`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error){
                if(error) {reject(errorCode.dbError)};
                resolve(errorCode.noError);
            })
        })
    }

    async deleteFriend(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            accepter : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `deleteFriend`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error){
                if(error) {reject(errorCode.dbError)};
                resolve(errorCode.noError);
            })
        })
    }

    async deleteBlock(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            blockedUser : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `deleteBlock`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error){
                if(error) {reject(errorCode.dbError)};
                resolve(errorCode.noError);
            })
        })
    }

    async deleteUser(userDto){
        this.#query = mybatisMapper.getStatement(`friendData`, `deleteUser`, param, this.#format);
        return new Promise((resolve,reject) => {
            this.#connection.query(this.#query, function(error){
                if(error){
                    reject(errorCode.dbError);
                    console.log(error);
                }
                resolve(errorCode.noError);
            })
        })
    }
}


module.exports = {MainDao}