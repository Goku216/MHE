import { configDotenv } from "dotenv";
import { User } from "../../db/models.js";
import bcrypt from "bcrypt";

configDotenv();

export async function changeSettings(req, res) {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    const user = await User.findOne({ where: { userid: userId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if username is unique
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser && existingUser.userid !== userId) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    // Check if email is unique
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail && existingEmail.userid !== userId) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // Handle password update
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    } else if (newPassword || currentPassword) {
      return res
        .status(400)
        .json({ error: "Both current and new passwords are required" });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
}
