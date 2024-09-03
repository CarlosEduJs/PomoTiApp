import User from "../../models/modelUser.js";
import { updateUserStatistics } from "./updateStates.js";

export const updateCycle = async (req, res) => {
  try {
    const { id, cycleId, updates } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, "cycles.cycleId": cycleId },
      { $set: { "cycles.$": updates } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User or cycle not found" });
    }

    await updateUserStatistics(id);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating cycle:", error);
    res.status(500).json({ error: "Failed to update cycle" });
  }
};
