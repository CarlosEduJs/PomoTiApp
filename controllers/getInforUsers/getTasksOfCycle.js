import User from "../../models/modelUser.js";

export const getAllTasksInCycle = async (req, res) => {
  try {
    const { id, cycleId } = req.params; // ID do usuário e do ciclo

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cycle = user.cycles.find((cycle) => cycle.cycleId === cycleId);

    if (!cycle) {
      return res.status(404).json({ error: "Cycle not found" });
    }

    res.status(200).json({ tasks: cycle.tasks });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro no servidor", details: error.message });
  }
};
