export const nodeConfigs = {
  form: {
    label: "Form",
    variant: "taskNode",
    description: "Collect user input through a customizable form.",
    formFields: [
      {
        name: "title",
        type: "text",
        placeholder: "Form title",
        required: true,
      },
      { name: "description", type: "text", placeholder: "Form description" },
      { name: "submitLabel", type: "text", placeholder: "Submit button label" },
    ],
  },
  telegram: {
    label: "Telegram",
    variant: "taskNode",
    description: "Send and receive messages via Telegram bot.",
    formFields: [
      {
        name: "botToken",
        type: "password",
        placeholder: "Bot Token",
        required: true,
      },
      { name: "chatId", type: "text", placeholder: "Chat ID", required: true },
      { name: "message", type: "text", placeholder: "Message text" },
    ],
  },
  whatsapp: {
    label: "WhatsApp",
    variant: "taskNode",
    description: "Automate WhatsApp messaging using API integration.",
    formFields: [
      {
        name: "phoneNumber",
        type: "text",
        placeholder: "Recipient phone number",
        required: true,
      },
      {
        name: "apiKey",
        type: "password",
        placeholder: "API Key",
        required: true,
      },
      { name: "message", type: "text", placeholder: "Message content" },
    ],
  },
  gmail: {
    label: "Gmail",
    variant: "taskNode",
    description: "Send emails via Gmail with OAuth authentication.",
    formFields: [
      {
        name: "recipient",
        type: "email",
        placeholder: "Recipient email",
        required: true,
      },
      { name: "subject", type: "text", placeholder: "Email subject" },
      { name: "body", type: "text", placeholder: "Email body" },
    ],
  },
  ai: {
    label: "AI Agent",
    variant: "aiNode",
    description: "Send a prompt to an AI model and get a response.",
    formFields: [
      {
        name: "prompt",
        type: "textarea",
        placeholder: "Enter your prompt here",
      },
      {
        name: "model",
        type: "select",
        placeholder: "Select a model",
        options: ["OpenAI", "Gemini", "Claude"],
      },
    ],
  },
};
