const User = require("../models/user")
const { verifyAccessToken, verifyRefreshToken } = require("../services/token")

const checkAuth = (req, res, next) => {

    try {

        const auth = req.headers.authorization

        // Si le token n'est pas présent dans les headers, on vérifie l'existence d'un refreshToken

        if( !auth ) return checkRefresh(req, res, next);

        // Sinon, on vérifie que le token présent dans les headers est valide

        const [type, token] = auth.split(' ')

        if( type !== 'Bearer' ) return res.status(401).json({ error: 'Attendu : Bearer token' })

        const data = verifyAccessToken(token)
        req.user = data.user
        next();

    } catch (error) {

        checkRefresh(req, res, next);

    }

}

const checkRefresh = async (req, res, next) => {

    const refreshToken = req.cookies.refreshToken

    if( !refreshToken ) return res.status(401).json({ error: 'Vous devez être connecté' })

    try {

        const { _id } = verifyRefreshToken(refreshToken)
        
        const user = await User.findByPk(_id)

        if( !user ) return res.status(401).json({ error: 'Vous n\'êtes pas autorisés à vous connecter !' })

        req.user = user

        return next();

    } catch (error) {

        throw new Error('Erreur lors de la vérification du token', error)

    }

}

const roles = {

    admin: 'admin',
    user: 'user'

}

const checkRole = (role, options = {}) => {

    return function (req, res, next) {

        const user = req.user

        const hierarchy = Object.keys(roles)

        if( req.body && options.securedFields ) {

            const securedFieldsFound = Object.keys(req.body).filter(field => options.securedFields.includes(field))

            if( securedFieldsFound.length ) {

                if( !user ) {

                    return res.status(401).json({ error: 'Vous devez être connecté' })

                }

                if( roles.hierarchy.indexOf(user.role) < hierarchy.indexOf(role) ) {

                    return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier ces champs' })

                }

                return next();

            }

        }

        if( options.anonymous ) return next();

        if( hierarchy.indexOf(user.role) < hierarchy.indexOf(role) ) {

            return res.status(403).json({ error: 'Vous n\'êtes pas autorisé à modifier ces champs' })

        }

        return next();

    }

}

const checkAdmin = (req, res, next) => {

    const user = req.user

    const hierarchy = Object.keys(roles)

    if( hierarchy.indexOf(user.role) < hierarchy.indexOf('admin') ) {

        req.user.isAdmin = false;

    } else {

        req.user.isAdmin = true;

    }

    next();

}


module.exports = {

    checkAuth, checkRefresh, checkRole, checkAdmin

}