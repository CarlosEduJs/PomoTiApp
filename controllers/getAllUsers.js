import User from "../models/modelUser.js";

export const getAllUsers = async (req, res) => {
  try {
    const { id } = req.params;
    let users;
    if (id) {
      users = await User.findOne(id);
    } else {
      users = await User.find();
    }
    res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro no servidor", details: error.message });
  }
};
