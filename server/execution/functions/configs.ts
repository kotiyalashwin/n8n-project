import { ExecGmail, ExecTelegram } from "./functions";

export const execFunctions = {
  manual: () => {
    console.log("------------------Workflow started----------");
  },
  telegram: (
    workflowid: string,
    data: { formData: { name: string; value: string }[] }
  ) => ExecTelegram(workflowid, data),
  gmail: (
    workflowid: string,
    data: { formData: { name: string; value: string }[] }
  ) => ExecGmail(workflowid, data),
};

export type ExecFunctions = typeof execFunctions;
