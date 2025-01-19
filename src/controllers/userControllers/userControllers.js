import { configDotenv } from "dotenv";
import { User } from "../../db/models.js";
import bcrypt from "bcrypt"

configDotenv()


export async function userRegister(req,res) {
    try {
        const {username,email,password,isAdmin}=req.body
        console.log(username,email,password,isAdmin);
       if (!username) {
        return res.status(400).json({
            message:"Username is required!",
        })
       }
       if (!email) {
        return res.status(400).json({
            message:"Email is required!",
        })
       }
       if (!password) {
        return res.status(400).json({
            message:"Password is required!",
        })
       }

       const hashedPassword=await bcrypt.hash(password,10)
        
       await User.create({
        username,
        email,
        password:hashedPassword,
        isAdmin
       })

       return res.json({
        username,
        email,
        password,
        isAdmin
       })

    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}


export async function userLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required!",
            });
        }

        if (!password) {
            return res.status(400).json({
                message: "Password is required!",
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                message: "User not found!",
            });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                message: "Invalid Password",
            });
        }

        const isAdmin = user.isAdmin;

        const token = jwt.sign(
            { userId: user.id, isAdmin },
            isAdmin ? process.env.JWT_SECRET_ADMIN : process.env.JWT_SECRET_USER,
            { expiresIn: "1h" } 
        );

        return res.json({
            token,
            isAdmin
        });

    } catch (error) {
        return res.json({
            message: error.message
        });
    }
}

