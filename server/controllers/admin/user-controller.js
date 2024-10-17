const User = require("../../models/User");

const getAllUsers = async (req, res) => {
  try {
    const result = await User.find({}, { password: 0 });
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

module.exports = getAllUsers;
