import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export const sendMail = async (options) => {
  const mailGenrator = new Mailgen({
    theme: "default",
    product: {
      name: "authenX",
      link: "https://mailgen.js/",
    },
  });

  const emailHtml = mailGenrator.generate(options.mailGenContent);
  const emailText = mailGenrator.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: env.MAILTRAP_SMTP_HOST,
    port: env.MAILTRAP_SMTP_PORT,
    secure: false,
    auth: {
      user: env.MAILTRAP_SMTP_USER,
      pass: env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "AuthenX <no-reply@authenx.com>",
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error("Email failed", error);
  }
};

export const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to AuthenX! We're very excited to have you on board.",
      action: {
        instructions: "To get started with AuthenX, please click here:",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export const forgotPasswordMailGenContent = (username, passwordRestUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset your password",
      action: {
        instructions: "To change your password click the button",
        button: {
          color: "#22BC66",
          text: "Reset password",
          link: passwordRestUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};
