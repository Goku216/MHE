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

       return res.status(400).json({
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