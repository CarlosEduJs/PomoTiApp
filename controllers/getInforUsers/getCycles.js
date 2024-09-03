import User from "../../models/modelUser.js";

export const getAllCycles = async (req, res) => {
  try {
    const { id } = req.params; // ID do usuário

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ cycles: user.cycles });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro no servidor", details: error.message });
  }
};
