import pinUsers from "../models/users.js";
import encrypt from "encryptjs";

export const checkRegistration = (req, res, next) => {
  try{
    const { username, email, password, confirmPassword, pin } = req.body;
    if (!username) return res.send("username is required.");
    if (!email) return res.send("Email is required.");
    if (!password) return res.send("Password is required.");
    if (!confirmPassword) return res.send("Confirm password is required.");
    if (!pin) return res.send("Pin is required.");
    next();
  }catch(err){
    return res.send(err);
  }
};

export const checkLogin = async (req, res, next) => {
  try{
    const { email, pin, password } = req.body;
    if (!email) return res.send("Email is required.");
    if (!password) return res.send("Password is required.");
    if (!pin) return res.send("Pin is required.");
    const user = await pinUsers.find({ email }).exec();
    if (!user.length) return res.send("user not found.");

    let flag = false;
    let secretKeyPin = "secretKeyPin";
    const decryptPin = encrypt.decrypt(user[0].pin, secretKeyPin, 256);
    let checkPin = parseInt(decryptPin);
    if(checkPin === pin){
      flag = true;
    }
    if(flag){
      next();
    }else{
      return res.send("Pin is incorrect.");
    }
  } catch (err) {
    return res.send(err);
  }
};

export const checkUpdate = async (req, res, next) => {
  try{
    const { username, email, pin, password } = req.body;
    if (!username) return res.send("Username is required.");
    if (!email) return res.send("Email is required.");
    if (!pin) return res.send("Pin is required.");
    if (!password) return res.send("Password is required.");
    const user = await pinUsers.find({ email }).exec();
    if (!user.length) return res.send("User not found.");
    let secretKeyPin = "secretKeyPin";
    const decryptPin = encrypt.decrypt(user[0].pin, secretKeyPin, 256);
    let flag = false;
    let checkPin = parseInt(decryptPin);
    if(pin === checkPin){
      flag = true;
    }
    if(flag){
      next();
    }else{
      return res.send("Pin is incorrect.");
    }
  } catch (err) {
    return res.send(err);
  }
};
