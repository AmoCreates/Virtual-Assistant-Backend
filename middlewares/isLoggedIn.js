import jwt from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).json({message: 'you need to login first'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
        
    } catch (error) {
        return res.status(401).json({message: "not authorized"});
    }
}

export default isLoggedIn;