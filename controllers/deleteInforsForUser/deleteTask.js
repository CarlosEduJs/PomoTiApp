import User from "../../models/modelUser.js";
import { updateUserStatistics } from "../updatesOfUser/updateStates.js";

export const deleteTask = async (req, res) => {
  try {
    const { id, cycleId, taskId } = req.params;

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, "cycles.cycleId": cycleId },
      { $pull: { "cycles.$.tasks": { taskId: taskId } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User, cycle, or task not found" });
    }

    await updateUserStatistics(id);

    res.status(200).json({ message: "Tarefa deletada com sucesso" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao deletar tarefa", details: error.message });
  }
};
