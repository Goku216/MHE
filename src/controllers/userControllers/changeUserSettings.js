import { configDotenv } from "dotenv";
import { User } from "../../db/models.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

configDotenv();

export async function changeSettings(req, res) {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    const user = await User.findOne({ where: { userid: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check for unique username and email in a single query
    if (username !== user.username || email !== user.email) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
          userid: { [Op.ne]: userId },
        },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Username or Email already taken" });
      }
    }

    // Password update validation
    if (
      (currentPassword && !newPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({ error: "Both current and new passwords are required" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
}
