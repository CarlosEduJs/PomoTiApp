import speakeasy from "speakeasy";
import {sendEmail} from '../nodemailer/nmSettings.js'

export const generate2FACode = () => {
  return speakeasy.totp({
    secret: process.env.TOTP_SECRET,
    encoding: "base32",
    step: 300,
  });
};

export const send2FACodeByEmail = async (userEmail) => {
  const code = generate2FACode();
  await sendEmail(userEmail, "Seu código 2FA", `Seu código 2FA é: ${code}`);
  return code;
};

export const verifyCode = async (code) => {
  return speakeasy.totp.verify({
    secret: process.env.TOTP_SECRET,
    encoding: "base32",
    token: code,
    window: 1,
  });
};
