const jwt = require('jsonwebtoken')

const createAccessToken = (payload) => {

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE })

}

const createRefreshToken = (payload) => {

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE })

}

const verifyAccessToken = (token) => {

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

}

const verifyRefreshToken = (token) => {

    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

}

module.exports = {

    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken

}