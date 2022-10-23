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
    async friendList(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `getFriendList`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error){
                    resolve(errorCode.dbError);
                }
                if(result.length === 0) resolve(errorCode.noResult);
                resolve(result);
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
    async blockList(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `getBlockList`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error){
                    resolve(errorCode.dbError);
                }
                if(result.length === 0) resolve(errorCode.noResult);
                resolve(result);
            })
        })
    }

    //유저 인덱스 가져오기
    async getUserIdx(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `getUserIdx`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error){
                    resolve(errorCode.dbError);
                }
                if(result.length === 0) resolve(errorCode.noResult);
                else resolve(result[0].idx);
            })
        })
    }

    async getEmail(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `getUserEmail`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error){
                    resolve(errorCode.dbError);
                }
                if(result.length === 0) resolve(errorCode.noResult);
                resolve(result[0].user_email);
            })
        })
    }

    async checkFriendRequest(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `checkFriendRequest`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error){
                    resolve(errorCode.dbError);
                }
                if(result.length === 0) resolve(errorCode.noResult);
                else resolve(result[0].status);
            })
        })
    }

    async checkBlock(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `checkFriendRequest`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error,result){
                if(error){
                    resolve(errorCode.dbError);
                }
                if(result.length === 0) resolve(errorCode.noResult);
                else resolve(errorCode.noError);
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
    async block(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `blockFriend`, param, this.#format);
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

    //친구요청
    async requestFriend(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `requestFriend`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error){
                    resolve(errorCode.dbError);
                }
                resolve(errorCode.noError);
            })
        })
    }

    async acceptFriend(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `acceptFriend`, param, this.#format);
        return new Promise((resolve) => {
            this.#connection.query(this.#query, function(error){
                if(error){
                    resolve(errorCode.dbError);
                }
                resolve(errorCode.noError);
            })
        })
    }

    async deleteFriend(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `deleteFriend`, param, this.#format);
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

    async deleteBlock(param){
        this.#query = mybatisMapper.getStatement(`friendData`, `deleteBlock`, param, this.#format);
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

    async deleteUser(param){
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