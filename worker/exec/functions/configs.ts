import { ExecAgentWrapper, ExecGmail, ExecTelegram } from "./functions";
type execData = {
	formData: { name: string, value: string }[],
	credentials: {
		info: { name: string; value: string }[];
		service: string;
	}[]
}


export const execFunctions = {
	manual: () => {
		console.log("------------------Workflow started----------");
	},
	telegram: (
		workflowid: string,
		data: execData
	) => ExecTelegram(workflowid, { formData: data.formData, credentials: data.credentials }),
	gmail: (
		workflowid: string,
		data: execData
	) => ExecGmail(workflowid, { formData: data.formData, credentials: data.credentials }),
	ai: (workflowid: string, data: execData) => ExecAgentWrapper(data)
};

export type ExecFunctions = typeof execFunctions;
