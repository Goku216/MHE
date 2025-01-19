export async function userControllers(req,res) {
    try {
        const {username,email,password,isAdmin}=req.body
        console.log(username,email,password,isAdmin);
        return{
            username,
            email,
            password,
            isAdmin
        }
        console.log(username,email,password,isAdmin);
    } catch (error) {
        return res.json({
            message:error.message
        })
    }
}