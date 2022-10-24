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
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) friendDto.setStatus(errorCode.dbError);
                else if(result.length === 0) friendDto.setStatus(errorCode.noResult);
                else friendDto.setStatus(result);

                resolve(0)
            })
        })
    }

    async login(userDto){
        const param = {
            userEmail:await userDto.getEmail()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `login`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) userDto.setError(errorCode.dbError);
                else{
                    if(result.length === 0) userDto.setError(errorCode.noResult);
                    else userDto.setError(result[0].is_deleted);
                }
                resolve(0);
            })
        })
    }

    //차단목록 가져오기
    async blockList(friendDto){
        const param = {
            userId : await friendDto.getRequester()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `getBlockList`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) friendDto.setStatus(errorCode.dbError);
                else if(result.length === 0) friendDto.setStatus(errorCode.noResult);
                else friendDto.setStatus(result);

                resolve(0)
            })
        })
    }

    //유저 인덱스 가져오기
    async getRequesterIdx(friendDto){
        const param = {
            userEmail : await friendDto.getRequester()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `getUserIdx`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error)friendDto.setRequester(errorCode.dbError);
                else if(result.length === 0) friendDto.setRequester(errorCode.noResult);
                else friendDto.setRequester(result[0].id);
                resolve(0);
            })
        })
    }

    async getAccepterIdx(friendDto){
        const param = {
            userEmail : await friendDto.getAccepter()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `getUserIdx`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error)friendDto.setAccepter(errorCode.dbError);
                else if(result.length === 0) friendDto.setAccepter(errorCode.noResult);
                else friendDto.setAccepter(result[0].id);
                resolve(0);
            })
        })
    }

    //유저 인덱스 가져오기
    async getRequesterEmail(friendDto){
        const param = {
            userId : await friendDto.getRequester()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `getUserEmail`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error)friendDto.setRequester(errorCode.dbError);
                else if(result.length === 0) friendDto.setRequester(errorCode.noResult);
                else friendDto.setRequester(result[0].email);
                resolve(0);
            })
        })
    }

    async getAccepterEmail(friendDto){
        const param = {
            userId : await friendDto.getAccepter()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `getUserEmail`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error)friendDto.setAccepter(errorCode.dbError);
                else if(result.length === 0) friendDto.setAccepter(errorCode.noResult);
                else friendDto.setAccepter(result[0].email);
                resolve(0);
            })
        })
    }

    async checkFriendRequest(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            accepter : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `checkFriendRequest`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) friendDto.setStatus(errorCode.dbError);
                if(result.length === 0) friendDto.setStatus(errorCode.noResult);
                else friendDto.setStatus(result[0].status);
                resolve(0)
            })
        })
    }

    async checkBlock(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            blockedUser : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `checkBlock`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error) friendDto.setStatus(errorCode.dbError);
                if(result.length === 0) friendDto.setStatus(errorCode.noResult);
                else friendDto.setStatus(errorCode.noError);
                resolve(0)
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
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error) userDto.setError(errorCode.dbError);
                else{
                    userDto.setError(errorCode.noError);
                }
                resolve(0);
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
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error) friendDto.setStatus(errorCode.dbError);
                else friendDto.setStatus(errorCode.noError);
                resolve(0)
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
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error) friendDto.setStatus(errorCode.dbError);
                else friendDto.setStatus(errorCode.noError);
                resolve(0)
            })
        })
    }

    async acceptFriend(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            accepter : await friendDto.getAccepter()
        }

        this.#query = mybatisMapper.getStatement(`friendData`, `acceptFriend`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error) friendDto.setStatus(errorCode.dbError);
                else friendDto.setStatus(errorCode.noError);
                resolve(0)
            })
        })
    }

    async deleteFriend(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            accepter : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `deleteFriend`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error) friendDto.setStatus(errorCode.dbError);
                else friendDto.setStatus(errorCode.noError);
                resolve(0)
            })
        })
    }

    async deleteBlock(friendDto){
        const param = {
            requester : await friendDto.getRequester(),
            blockedUser : await friendDto.getAccepter()
        }
        this.#query = mybatisMapper.getStatement(`friendData`, `deleteBlock`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error) friendDto.setStatus(errorCode.dbError);
                else friendDto.setStatus(errorCode.noError);
                resolve(0)
            })
        })
    }

    async deleteUser(userDto){
        this.#query = mybatisMapper.getStatement(`friendData`, `deleteUser`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error){
                    resolve(errorCode.dbError);
                    console.log(error);
                }
                resolve(errorCode.noError);
            })
        })
    }
}


module.exports = {MainDao}