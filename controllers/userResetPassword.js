import User from "../models/modelUser.js";
import bcrypt from "bcryptjs";
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
        await sendLinkResetPassowrd(user._id, email, resetToken);

        res.status(200).json({ message: "Link de redefinição enviado para seu email!", id: user._id });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Erro no servidor" });
    }
}

export const resetPasswordReset = async (req, res) => {
    const { id, token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findById(id);

        if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
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

export const verifyToken = async (req, res) => {
    const { id, token } = req.query;

    try {
        // Encontrar o usuário com base no ID e verificar o token
        const user = await User.findById(id);

        if (!user) {
            return res.status(400).json({ valid: false, message: 'Usuário não encontrado' });
        }

        // Verificar se o token bate e se não expirou
        if (user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ valid: false, message: 'Token inválido ou expirado' });
        }

        // Se o token for válido
        res.status(200).json({ valid: true, message: 'Token válido' });
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(500).json({ valid: false, message: 'Erro no servidor' });
    }
};
