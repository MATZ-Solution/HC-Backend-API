const jwt = require('jsonwebtoken')
const { default: axios } = require("axios");
const verifyGoogleToken = (req, res, next) => {

    const googleAccessToken = req.headers.authorization.split(" ")[1]
    console.log(googleAccessToken,"token")

    axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${googleAccessToken}`,
            },
        })
        .then((res) => {
            req.user=res.data
            // console.log(res,"user")
            next()
        })
        .catch((error) => {
            res.status(400).json("invalid access token")
        });

}

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
        const token = authorization.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) {
                res.status(400).json(err)
            } else {
                req.user = user;
                next();
            }
        })
    } else {
        res.status(400).json("you are not authenticated");
    }
}

const verifyTokenAndCorporate = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin === "corporate") {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

const verifyTokenAndCorporateAndSuperAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin === "corporate" || req.user.isAdmin === "super-admin") {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

const verifyTokenAndCareGivers = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin === "care-givers") {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin === "super-admin") {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndCorporate,
    verifyTokenAndCareGivers,
    verifyTokenAndCorporateAndSuperAdmin,
    verifyGoogleToken
};