const errorCode = {
    isDeleted : 1,
    noError : -1,
    dbError : -2,
    noResult : -3
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