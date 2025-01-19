export async function userRegister(req,res) {
    try {
        const {username,email,password,isAdmin}=req.body
        console.log(username,email,password,isAdmin);
       if (!username) {
        return res.json({
            message:"Username is required!",
        })
       }
       if (!email) {
        return res.json({
            message:"Email is required!",
        })
       }
       if (!password) {
        return res.json({
            message:"Password is required!",
        })
       }

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