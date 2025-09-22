import axios from "axios";
import { SendMail } from "../../resend";
import { RunAgent, type DataConfig } from "../agent";

export const ExecTelegram = async (
	workflowId: string,
	data: {
		formData: { name: string; value: string }[];
		credentials: {
			info: { name: string; value: string }[];
			service: string;
		}[];
	},
) => {
	console.log("reached exec telegram")
	try {
		const chatId = data.formData
			.find((field) => field.name === "chatId")
			?.value.trim();
		const message = data.formData.find(
			(field) => field.name === "message",
		)?.value;
		if (!chatId || !message) {
			throw new Error("ChatId and message are required");
		}

		const { credentials } = data;
		if (!data.credentials) {
			throw new Error("Credentials not found");
		}

		const credentialsData = credentials as {
			info: { name: string; value: string }[];
			service: string;
		}[];

		const telegramCreds = credentialsData.find(
			(cred) => cred.service === "Telegram",
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
			},
		);

		if (!response.data.ok) {
			throw new Error("Failed to send message");
		}

		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const ExecGmail = async (
	workflowId: string,
	data: {
		formData: { name: string; value: string }[];
		credentials: {
			info: { name: string; value: string }[];
			service: string;
		}[];
	},
) => {
	const recipientMail = data.formData
		.find((field) => field.name === "recipient")
		?.value.trim();
	const mailSubject = data.formData.find(
		(field) => field.name === "subject",
	)?.value;
	const mailBody = data.formData.find((field) => field.name === "body")?.value;

	if (!recipientMail || !mailBody) {
		throw new Error("Recipient, subject, and body are required");
	}
	const { credentials } = data;
	if (!data.credentials) { throw new Error("Credentials not found"); }
	const credentialsData = credentials as { info: { name: string; value: string }[]; service: string; }[];
	const gmailCreds = credentialsData.find((cred) => cred.service === "Gmail");
	const resendKey = gmailCreds?.info.find((info) => info.name === "ResendKey")?.value.trim();

	await SendMail({
		to: recipientMail,
		subject: mailSubject ?? "No subject (maybe from agent)",
		body: mailBody,
		key: resendKey,
	});
	return true;
};



export const ExecAgentWrapper = async (data: {
	formData: { name: string; value: string[] | string }[];
	credentials: {
		info: { name: string; value: string }[];
		service: string;
	}[];
}) => {
	//console.log("execAgentCalled")
	try {
		const rawTools = data.formData.find(d => d.name === "tools")?.value; // "[\"telegram"\ , \"gmail"\]"
		const agentCreds = data.credentials.find(c => c.service === "Agent");

		const botToken = agentCreds?.info.find(i => i.name === "Bot Token");
		if (!botToken) {
			throw new Error("Credentials not found");
		}

		const telegramCredentials = {
			service: "Telegram",
			info: [botToken], // must be an array!
		};
		const filteredFormData = data.formData.filter(d => d.name !== "tools") as {
			name: string;
			value: string;
		}[];
		//if (typeof tools === "string") return;
		const tools = JSON.parse(rawTools)
		const agentPayload: DataConfig = {
			tools: tools?.length !== 0 ? tools : [],
			data: {
				formData: filteredFormData,
				credentials: [telegramCredentials],
			},
		};
		try { await RunAgent(agentPayload) } catch (e) { console.log(e) };
		return true;
	} catch (e) { console.log(e); return false }
}

