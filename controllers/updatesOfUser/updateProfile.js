import User from "../../models/modelUser.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    let updateData = { name, email };

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 8);
      updateData.password = hashedPassword;
    }

    // Atualiza o usuário com os dados fornecidos e retorna o documento atualizado
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro no servidor", details: error.message });
  }
};
