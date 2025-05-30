import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs'
import transporter from '../nodemailer.js';

export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = new UserModel({ name, email, password: hashedPassword });
    await users.save();

    const token = jwt.sign({ id: users._id }, process.env.SECRET_TOKEN, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameTime: process.env.NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from : process.env.SENDER_EMAIL,
      to : email,
      subject : `Welcome To Our Website ${name}`,
      text : `Token : ${token}`
    }

    await transporter.sendMail(mailOptions)

    return res.json({
      success: true,
      message: "Register Success.",
      mess: console.log("Register Success"),
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Something Wrong!",
      err: error,
    });
  }
};

export const SignIn = async(req, res) => {
  const {email, password} = req.body;

  try {
    const user = await UserModel.findOne({email})

    if(!user){
      return res.json({success : false, message : "User Not Found"})
    }

    const passwordMatch = await bcrypt.compare(password, user.password);


    if(!passwordMatch){
      return res.json({success : false, message : "Password are match"})
    }

    const token = jwt.sign({id : user._id}, process.env.NODE_ENV, {expiresIn : '7d'})

    res.cookie('token', token, {
      httpOnly : true,
      secure : process.env.NODE_ENV === "production",
      sameSite : process.env.NODE_ENV === "production" ? 'none' : 'strict',
      maxAge : 7 * 24 * 60 * 60 * 1000
    })

    return res.json({users : user, success : true, message : "login success"})

  } catch (error) {
    return res.json({success : false, error : error})
  }
}

export const Logout = async (req, res) => {
  try {
    res.clearCookie('token',{
      httpOnly : true,
      secure : process.env.NODE_ENV === 'production',
      sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })

    return res.json({success : true, message : "Logged Out"})

  } catch (error) {
    return res.json({success : false, message : "Failed", err : error.message})
  }
}