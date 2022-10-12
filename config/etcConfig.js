const errorCode = {
    noError : 0,
    dbError : -1,
    noResult : -2
}

const maxLength = {
    email : 5,
    password :5
}

const friendStatus = {
    request : 0,
    accept : 1
}

module.exports = {
    errorCode,
    maxLength,
    friendStatus
}