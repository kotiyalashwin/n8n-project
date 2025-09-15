import { WorkFlowEditor } from "@/components/WorkFlowEditor";

export default async function Page({ params }: { params: { id: string } }) {
  const workFlowId = (await params).id;
  console.log(workFlowId);

  return <WorkFlowEditor workFlowId={workFlowId} />;
}
