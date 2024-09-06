import speakeasy from "speakeasy";
import { sendEmail } from '../nodemailer/nmSettings.js'

export const generate2FACode = (secret) => {
  return speakeasy.totp({
    secret: secret,
    encoding: "base32",
    step: 300,
  });
};

export const send2FACodeByEmail = async (user) => {
  const code = generate2FACode(user.twoFactorSecret);
  await sendEmail(user.email, "Seu código 2FA", `Seu código 2FA é: ${code}`);
  return code;
};
