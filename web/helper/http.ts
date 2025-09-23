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
      "http://ec2-34-203-28-254.compute-1.amazonaws.com:8000/workflow/save",
      body
    );
    await axios.post("http://ec2-34-203-28-254.compute-1.amazonaws.com:8000/credentials/new", {
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
      `http://ec2-34-203-28-254.compute-1.amazonaws.com:8000/workflow/${workflowid}`
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
    const response = await axios.get(`http://ec2-34-203-28-254.compute-1.amazonaws.com:8000/credentials`, {
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
