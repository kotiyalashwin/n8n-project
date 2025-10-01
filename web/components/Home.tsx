export const HomePage = () => {
  return (
    <div className="w-full h-full flex justify-center gap-4 items-center flex-col">
      <h1 className="text-3xl">
        x8x is implementation of <a href="https://n8n.io">N8N</a> from scratch.
      </h1>
      <p>
        Click on the <span className="border border-accent px-4">+New</span>{" "}
        button on the left pane and create AI powered workflows
      </p>
    </div>
  );
};
