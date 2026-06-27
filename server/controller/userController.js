
import User from "../models/user.js";
import { sendWelcomeEmail } from "../utils/emailService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "../config/googleAuth.js";

const generateToken=(userId)=>{
    const token = jwt.sign({userId},process.env.SECRET,{expiresIn:'7d'})
    return token;
}

export const registerUser=async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        if(!name|| !email || !password){
            return res.status(400).json({
                message:"All fields are required",
            })
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                message:"user already exist"
            })
        }
         const hashedPassword = await bcrypt.hash(password,10);
         const newUser= await User.create({
            name:name,
            email:email,
            password: hashedPassword,
         })
        
        // Send welcome email
        sendWelcomeEmail(email, name);
        
        const token = generateToken(newUser._id);
        newUser.password = undefined;
        res.status(201).json({
            message:"user registered Successfully",
            token,
            user:newUser
        })



    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

// api/user/login
export const LoginUser=async(req,res)=>{
    try{
        const {email,password} = req.body;

    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"user not registered"
        })
    } 
    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        const token = generateToken(user._id);
        user.password = undefined;
        return res.status(200).json({
            message:"user logged in Successfully",
            token,
            user
        })
    }
    return res.status(400).json({
        message:"invalid credentials"
    })


    }

    catch(error){
          
        console.log(error)
        res.status(500).json({
            message:"Internal server error"
        })
    }

}

export const forgotPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                message: "Email and new password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found with this email"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

// Google OAuth Routes
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=no_user`
      );
    }

    const token = generateToken(req.user._id);
    const userParam = encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    }));

    res.redirect(
      `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${userParam}`
    );
  } catch (error) {
    console.log(error);
    res.redirect(
      `${process.env.CLIENT_URL}/login?error=auth_failed`
    );
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message: "User profile retrieved successfully",
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};