export const nodeConfigs = {
  manual: {
    label: "Manual Trigger",
    variant: "manualNode",
    description: "This node is triggered manually by user.",
    credentials: [],
    formFields: [],
    modes: [],
  },
  telegram: {
    label: "Telegram",
    variant: "taskNode",
    description: "Send messages via Telegram bot.",
    credentials: [
      {
        label: "Bot Token",
        name: "Bot Token",
        type: "text",
        required: true,
      },
    ],
    formFields: [
      {
        label: "ChatId",
        name: "chatId",
        type: "text",
        placeholder: "",
        required: true,
      },
      {
        label: "Message",
        name: "message",
        type: "text",
        placeholder: "",
      },
    ],
    modes: [
      { value: "send", label: "Send Message", producesOutput: false },
      { value: "listen", label: "Reviece Messages", producesOutput: true },
    ],
  },
  gmail: {
    label: "Gmail",
    variant: "taskNode",
    description: "Send emails powered by Resend",
    credentials: [
      {
        label: "API Key (optional)",
        name: "ResendKey",
        placeholder: "Resend API Key",
        type: "text",
        required: false,
      },
    ],
    formFields: [
      {
        label: "Recipient email",
        name: "recipient",
        type: "email",
        placeholder: "",
        required: true,
      },
      {
        label: "Subject",
        name: "subject",
        type: "text",
        placeholder: "",
      },
      {
        label: "Email Body",
        name: "body",
        type: "text",
        placeholder: "Email body",
        required: true,
      },
    ],
    modes: [{ value: "send", label: "Send Mail", producesOutput: false }],
  },
  ai: {
    label: "Agent",
    variant: "aiNode",
    credentials: [],
    modes: [],
    description: "Prompt based tool calling for the other nodes.",
    formFields: [
      {
        label: "User Prompt",
        name: "prompt",
        type: "textarea",
        placeholder: "Enter your prompt here",
      },
    ],
  },
};
