import axios from "axios";
import { db } from "../../prisma/db";
import { SendMail } from "../../helper/resend";

export const ExecTelegram = async (
  workflowId: string,
  data: {
    formData: { name: string; value: string }[];
  }
) => {
  const chatId = data.formData
    .find((field) => field.name === "chatId")
    ?.value.trim();
  const message = data.formData.find(
    (field) => field.name === "message"
  )?.value;

  if (!chatId || !message) {
    throw new Error("ChatId and message are required");
  }

  const credentials = await db.credentials.findUnique({
    where: {
      workFlowId: workflowId,
    },
  });

  if (!credentials) {
    throw new Error("Credentials not found");
  }

  const credentialsData = credentials.credentials as {
    info: { name: string; value: string }[];
    service: string;
  }[];

  const telegramCreds = credentialsData.find(
    (cred) => cred.service === "Telegram"
  );
  const botToken = telegramCreds?.info
    .find((info) => info.name === "Bot Token")
    ?.value.trim();

  if (!botToken) {
    throw new Error("Telegram bot token not found");
  }

  const response = await axios.post(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      chat_id: chatId,
      text: message,
    }
  );

  if (!response.data.ok) {
    throw new Error("Failed to send message");
  }

  return true;
};

export const ExecGmail = async (
  workflowId: string,
  data: {
    formData: { name: string; value: string }[];
  }
) => {
  const recipientMail = data.formData
    .find((field) => field.name === "recipient")
    ?.value.trim();
  const mailSubject = data.formData.find(
    (field) => field.name === "subject"
  )?.value;
  const mailBody = data.formData.find((field) => field.name === "body")?.value;

  if (!recipientMail || !mailSubject || !mailBody) {
    throw new Error("Recipient, subject, and body are required");
  }

  const credentials = await db.credentials.findUnique({
    where: {
      workFlowId: workflowId,
    },
  });

  if (!credentials) {
    throw new Error("Credentials not found");
  }

  const credentialsData = credentials.credentials as {
    info: { name: string; value: string }[];
    service: string;
  }[];

  const gmailCreds = credentialsData.find((cred) => cred.service === "Gmail");
  const resendKey = gmailCreds?.info
    .find((info) => info.name === "ResendKey")
    ?.value.trim();

  await SendMail({
    to: recipientMail,
    subject: mailSubject,
    body: mailBody,
    key: resendKey,
  });
  return true;
};
