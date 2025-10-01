import type { RedisClient } from ".";

export type SendMailProps = {
  to: string;
  subject?: string;
  body: string;
  key?: string;
};

export type ExecNode = {
  nodeId: string;
  type: string;
  parents?: string[];
  data: {
    formData?: { name: string; value: string }[];
    credentials: {
      info: { name: string; value: string }[];
      service: string;
    }[];
  };
  workflowId: string;
};

export type ExecuteFunctionProps = {
  redis: RedisClient;
  node: ExecNode;
};

export type Credentials = {
  service: string;
  info: { name: string; value: string }[];
};

export type DataConfig = {
  tools: string[] | undefined;
  data: {
    formData: { name: string; value: string }[];
    credentials: {
      info: { name: string; value: string }[];
      service: string;
    }[];
  };
};
