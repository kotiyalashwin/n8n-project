import { ExecGmail, ExecTelegram } from "./functions";

export const execFunctions = {
  manual: () => {
    console.log("------------------Workflow started----------");
  },
  telegram: (
    workflowid: string,
    data: {
      formData: { name: string; value: string }[];
      credentials: {
        info: { name: string; value: string }[];
        service: string;
      }[];
    }
  ) => ExecTelegram(workflowid, data),
  gmail: (
    workflowid: string,
    data: {
      formData: { name: string; value: string }[];
      credentials: {
        info: { name: string; value: string }[];
        service: string;
      }[];
    }
  ) => ExecGmail(workflowid, data),
};

export type ExecFunctions = typeof execFunctions;
