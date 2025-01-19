export async function userRegister(req,res) {
    try {
        const {username,email,password,isAdmin}=req.body
        console.log(username,email,password,isAdmin);
        return res.json({
            username,
            email,
            password,
            isAdmin
        })
        console.log(username,email,password,isAdmin);
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}