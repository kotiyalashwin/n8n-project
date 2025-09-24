import { Edge, Node } from "@xyflow/react";
import axios from "axios";
import { embeddNodeData } from "./embeddFormData";
import { useCredentialStore } from "@/store/credentials";
import { BACKEN_URL } from "@/costant";

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
            `${BACKEN_URL}/workflow/save`,
      body
    );
    await axios.post(`${BACKEN_URL}/credentials/new`, {
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
      `${BACKEN_URL}/workflow/${workflowid}`
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
    const response = await axios.get(`${BACKEN_URL}/credentials`, {
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
