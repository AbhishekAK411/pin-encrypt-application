import pinUsers from "../models/users.js";
import encrypt from "encryptjs";

export const userRegistration = async (req,res) =>{
    try{
        const {username, email, password, confirmPassword, pin} = req.body;
        const user = await pinUsers.find({email}).exec();
        if(user.length > 0) return res.send("User is already registered.");
        if(password.length < 8 && confirmPassword.length < 8){
            return res.send("Password should be more than 8 characters.");
        }
        if(password !== confirmPassword){
            return res.send("Password's do not match.");
        }
        let secretKeyPass = "secretKeyPass";
        const encryptPass = encrypt.encrypt(password, secretKeyPass, 256);
        let secretKeyPin = "secretKeyPin";
        let pinString = pin.toString();
        const encryptPin = encrypt.encrypt(pinString, secretKeyPin, 256);
        const users = new pinUsers({
            username,
            email,
            password : encryptPass,
            pin : encryptPin
        });
        await users.save();
        return res.send("User registered successfully");
        
    }catch(err){
        return res.send(err);
    }
}

export const userLogin = async (req,res) =>{
    try{
        const {email, password} = req.body;
        const user = await pinUsers.find({email}).exec();
        if(!user.length) return res.send("User not found.");

        let secretKeyPass = "secretKeyPass";
        const decryptPass = encrypt.decrypt(user[0].password, secretKeyPass, 256);
        if(password == decryptPass){
            return res.send("Login Successful.");
        }
        return res.send("Credentials do not match.");

    } catch(err){
        return res.send(err);
    }
}

export const userUpdate = async (req,res) =>{
    try{
        const {username, email, password} = req.body;
        const user = await pinUsers.find({email}).exec();
        if(!user.length) return res.send("User not found.");
        let secretKeyPass = "secretKeyPass";
        const encryptPass = encrypt.encrypt(password, secretKeyPass, 256);
        const response = await pinUsers.findOneAndUpdate({email}, {username, password: encryptPass}).exec();
        await response.save();
        return res.send("User updated successfully.");
    }catch(err){
        return res.send(err);
    }
}