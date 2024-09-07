import User from "../models/modelUser.js";

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne(id);

        res.status(200).json(user);
    } catch (error) {
        return res
            .status(500)
            .json({ error: "Erro no servidor", details: error.message });
    }
};
