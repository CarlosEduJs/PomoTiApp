import User from "../models/modelUser.js";
import crypto from "crypto";

import { sendLinkResetPassowrd } from "../speakease/skSettings.js";

export const sendLinkPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "Usuario não encontrado!" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();
        await sendLinkResetPassowrd(email);

        res.status(200).json({ message: "Link de redefinição enviado para seu email!" });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Erro no servidor" });
    }
}

export const resetPasswordReset = async (req, res) => {
    const { token, newPassword } = req.body;

    try {

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Token inválido ou expirado' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 8);
        user.password = hashedPassword;


        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }

}