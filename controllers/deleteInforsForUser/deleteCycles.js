import User from "../../models/modelUser.js";
import { updateUserStatistics } from "../updatesOfUser/updateStates.js";

export const deleteCycle = async (req, res) => {
  try {
    const { id, cycleId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $pull: { cycles: { cycleId } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User or cycle not found" });
    }

    await updateUserStatistics(id);

    res.status(200).json({ message: "Ciclo deletado com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao deletar ciclo", details: error.message });
  }
};
