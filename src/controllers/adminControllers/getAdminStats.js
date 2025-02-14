import { configDotenv } from "dotenv";
import { User } from "../../db/models.js";
configDotenv();

export const getAdmin = async (req, res) => {
  try {
    // Await the promise returned by the findOne query
    const admin = await User.findOne({
      where: {
        isAdmin: true,
      },
    });

    // Check if admin was found
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Send the admin data as the response
    res.json(admin);
  } catch (error) {
    // Handle any errors that occur during the query
    res.status(500).json({ message: error.message });
  }
};
