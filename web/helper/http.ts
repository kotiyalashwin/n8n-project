import { Edge, Node } from "@xyflow/react";
import axios from "axios";
import { embeddNodeData } from "./embeddFormData";
import { useCredentialStore } from "@/store/credentials";

export const saveWorkflow = async (
  workFlowId: string,
  nodes: Node[],
  edges: Edge[]
) => {
  try {
    const finalNodes = embeddNodeData(nodes);
    const credentials = useCredentialStore.getState().credentials;
    const body = {
      id: workFlowId,
      nodes: finalNodes,
      edges,
    };
    const response = await axios.post(
      "https://api.x8x.com/workflow/save",
      body
    );
    await axios.post("https://api.x8x.com/credentials/new", {
      workflowid: workFlowId,
      credentials,
    });
    const data = await response.data;
    return data.message as string;
  } catch (e) {
    console.log(e);
    throw new Error("Unable to save WorkFlow");
  }
};

export const getWorkflow = async (workflowid: string) => {
  try {
    const response = await axios.get(
      `https://api.x8x.com/workflow/${workflowid}`
    );
    const nodesData = await response.data;
    const credentialData = await getCredentials(workflowid);
    return { nodesData, credentialData };
  } catch (e) {
    console.log(e);
    throw new Error();
  }
};

const getCredentials = async (workflowid: string) => {
  try {
    const response = await axios.get(`https://api.x8x.com/credentials`, {
      params: {
        workflowid,
      },
    });
    const data = await response.data;
    return data.credentials;
  } catch (e) {
    console.log(e);
    throw new Error("Unable to fetch credentials");
  }
};
