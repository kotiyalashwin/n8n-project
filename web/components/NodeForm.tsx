import { nodeConfigs } from "@/lib/nodes";

export default function NodeForm({ type }: { type: string }) {
  const config = nodeConfigs[type as keyof typeof nodeConfigs];

  if (!config) return <p>Unknown node type</p>;

  return (
    <form className="flex flex-col gap-3">
      {config.formFields.map((field) => (
        <input
          key={field.name}
          type={field.type}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          className="border rounded p-2"
        />
      ))}
    </form>
  );
}
