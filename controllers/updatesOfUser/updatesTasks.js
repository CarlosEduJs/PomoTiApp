import User from "../../models/modelUser.js";
import { updateUserStatistics } from "./updateStates.js";

export const updateTask = async (req, res) => {
  try {
    const { id, cycleId, taskId, updates } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, "cycles.cycleId": cycleId, "cycles.tasks.taskId": taskId },
      { $set: { "cycles.$.tasks.$[elem]": updates } },
      { arrayFilters: [{ "elem.taskId": taskId }], new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User or task not found" });
    }

    await updateUserStatistics(id);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};
