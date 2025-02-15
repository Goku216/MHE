import { configDotenv } from "dotenv";
import { User } from "../../db/models.js";
import bcrypt from "bcrypt";
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

export const updateAdminStats = async (req, res) => {
  try {
    const { username, email } = req.body;

    const admin = await User.findOne({
      where: {
        isAdmin: true,
      },
    });

    // Check if admin was found
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (username) admin.username = username;
    if (email) admin.email = email;

    await admin.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminPass = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const admin = await User.findOne({
      where: {
        isAdmin: true,
      },
    });

    // Check if admin was found
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
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
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    await admin.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.destroy({
      where: { userid: userId },
    });

    // If no rows are affected, it means the item wasn't found
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send a success response
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
