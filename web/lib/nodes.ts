
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
		description: "Send messages via Telegram bot.",
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
	},
	ai: {
		label: "Agent",
		variant: "aiNode",
		credentials: [],
		description: "Prompt based tool calling for the other nodes.",
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
