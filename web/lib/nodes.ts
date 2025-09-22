import { Label } from "@radix-ui/react-select";

export const nodeConfigs = {
	// form: {
	//   label: "Form",
	//   variant: "taskNode",
	//   description: "Collect user input through a customizable form.",
	//   formFields: [
	//     {
	//       name: "title",
	//       type: "text",
	//       placeholder: "Form title",
	//       required: true,
	//     },
	//     { name: "description", type: "text", placeholder: "Form description" },
	//     { name: "submitLabel", type: "text", placeholder: "Submit button label" },
	//   ],
	// },
	manual: {
		label: "Manual Trigger",
		variant: "manualNode",
		description: "This node is triggered manually by user.",
		credentials: [],
		formFields: [],
	},
	telegram: {
		label: "Telegram",
		variant: "taskNode",
		description: "Send and receive messages via Telegram bot.",
		credentials: [
			{
				label: "Bot Token",
				name: "Bot Token",
				type: "text",
				required: true
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
	},
	whatsapp: {
		label: "WhatsApp",
		variant: "taskNode",
		description: "Automate WhatsApp messaging using API integration.",
		credentials: [],
		formFields: [
			{
				label: "",
				name: "phoneNumber",
				type: "text",
				placeholder: "Recipient phone number",
				required: true,
			},
			{
				label: "",
				name: "apiKey",
				type: "password",
				placeholder: "API Key",
				required: true,
			},
			{
				label: "",
				name: "message",
				type: "text",
				placeholder: "Message content",
			},
		],
	},
	gmail: {
		label: "Gmail",
		variant: "taskNode",
		description: "Send emails via Gmail with OAuth authentication.",
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
	},
	ai: {
		label: "Agent",
		variant: "aiNode",
		credentials: [],
		description: "Send a prompt to an AI model and get a response.",
		formFields: [
			{
				label: "User Prompt",
				name: "prompt",
				type: "textarea",
				placeholder: "Enter your prompt here",
			}
		],
	},
};
