import User from "../../models/modelUser.js";

export const getSingleTaskInCycle = async (req, res) => {
  try {
    const { id, cycleId, taskId } = req.params; // ID do usuário, ciclo, e tarefa

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cycle = user.cycles.find((cycle) => cycle.cycleId === cycleId);

    if (!cycle) {
      return res.status(404).json({ error: "Cycle not found" });
    }

    const task = cycle.tasks.find((task) => task.taskId === taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ task });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro no servidor", details: error.message });
  }
};
