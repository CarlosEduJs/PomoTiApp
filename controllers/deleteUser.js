import User from "../models/modelUser.js";

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Usuario deletado com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar tarefa", details: error.message });
  }
};
