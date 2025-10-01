import {
  ExecAgentWrapper,
  ExecGmail,
  ExecTelegram,
  ListenTelegram,
} from "./functions";

type execData = {
  formData: { name: string; value: string }[];
  credentials: {
    info: { name: string; value: string }[];
    service: string;
  }[];
  context?: string[];
};

export const execFunctions = {
  manual: () => {
    console.log("------------------Workflow started----------");
  },
  //configure for receiving context
  telegram: (workflowid: string, data: execData) => {
    const mode = data.formData.find((f) => f.name === "mode")?.value || "send";
    if (mode === "send") {
      return ExecTelegram({
        formData: data.formData,
        credentials: data.credentials,
        context: {
          message: data.context?.join(",") || "",
        },
      });
    } else {
      //modes is listen
      //this will return some context
      return ListenTelegram(data.credentials);
    }
  },
  gmail: (workflowid: string, data: execData) =>
    ExecGmail(workflowid, {
      formData: data.formData,
      credentials: data.credentials,
    }),
  ai: (workflowid: string, data: execData) => ExecAgentWrapper(data),
};

export type ExecFunctions = typeof execFunctions;
