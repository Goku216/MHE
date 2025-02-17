import { configDotenv } from "dotenv";
import { User } from "../../db/models.js";
configDotenv();

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      where: {
        isAdmin: false,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
