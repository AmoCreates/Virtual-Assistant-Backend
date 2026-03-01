import Joi from "joi";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

const signupUser = async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    try {
        const { username, email, password } = req.body;
        
        const userExists = await userModel.findOne({ email });
        if (userExists) return res.status(400).json({ message: "email already exists" });

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });

        const token = await generateToken(user._id);
        
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 3600 * 24 * 7,
            sameSite: "strict",
            secure: false // set to true in production
        });

        return res.status(201).json(user); 
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const signinUser = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    let {email, password} = req.body;

    let user = await userModel.findOne({email});
    if(!user) {
        return res.status(400).json({mesage:"either email or password is wrong"});
    }

    bcrypt.compare(password, user.password, function(err, result) {
        if(result) {
            let token = generateToken(user);
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 1000*3600*24*7,
                sameSite: "strict",
                secure: false
            });
            res.status(202).json({message: "user successfully logged in"});
        }
        else {
            return res.status(400).json({message: "either email or password is wrong"});
        }
    });

}

const logout = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({message: "log out successfully"})
    } catch (error) {
        return res.status(500).json({message: `something went wrong!! try again ${error}`})
    }

}

export {signupUser, signinUser, logout};