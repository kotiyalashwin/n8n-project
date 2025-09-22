"use client";

import { nodeConfigs } from "@/lib/nodes";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormEvent, useState } from "react";
import { CredentialModal } from "../CredentialModal";
import { useCredentialStore } from "@/store/credentials";
import { Button } from "../ui/button";
import { useNodeDataStore } from "@/store/nodedata";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function NodeForm({
	type,
	nodeId,
}: {
	type: string;
	nodeId: string;
}) {

	const config = nodeConfigs[type as keyof typeof nodeConfigs];
	const [credentialModal, setCredentialModal] = useState(false);
	const { credentials } = useCredentialStore();
	const { addNodeData, getNodeData } = useNodeDataStore();
	const [submitting, setSubmitting] = useState(false);
	const savedData = getNodeData(nodeId);
	const [selectedTools, setSelectedTools] = useState<string[]>([]);
	const [selectedCredentials, setSelectedCredentials] = useState("");
	const availableTools = [
		"telegram",
		"gmail",
	];
	const [dymanicCredentialFiels, setDynamicCredentialFields] = useState<{ label: string, name: string, type: string, required: boolean }[]>([])
	const handleToolSelection = (tool: string) => {
		const reqCred = nodeConfigs[tool as keyof typeof nodeConfigs].credentials
		setDynamicCredentialFields((prev) => { return [...prev, ...reqCred] })
		setSelectedTools(prev => {
			if (prev.includes(tool)) {
				return prev.filter(t => t !== tool);
			} else {
				return [...prev, tool];
			}
		});
	};
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		setSubmitting(true);
		e.preventDefault();
		if (selectedTools.includes("telegram") && !selectedCredentials) {
			toast.error("Please select credentials when using Telegram tool", {
				classNames: {
					toast: "",
				},
			});
			setSubmitting(false)
			return;
		}
		const formData = new FormData(e.currentTarget);
		const nodeFormData = config.formFields.map((f) => ({
			name: f.name,
			value: formData.get(f.name) as string,
		}));

		const finalData = [
			...nodeFormData,
			{
				name: "credentials",
				value: formData.get("credentials") as string,
			},
		];

		if (type === "ai") {
			finalData.push({
				name: "tools",
				value: JSON.stringify(selectedTools),
			});

			// Add chat ID if telegram is selected
			if (selectedTools.includes("telegram")) {
				finalData.push({
					name: "chatId",
					value: formData.get("chatId") as string,
				});
			}
		}
		//adds to the zustand
		console.log(finalData)
		addNodeData({
			nodeId,
			data: finalData
		});
		setTimeout(() => {
			setSubmitting(false);
			toast.success("Configuration Saved", {
				classNames: {
					toast: "",
				},
			});
		}, 1000);
	};

	if (!config) return <p>Unknown node type</p>;

	return (
		<div className="h-full">
			<form onSubmit={handleSubmit} className="flex h-full flex-col gap-4">
				<h1 className="text-3xl font-semibold text-foreground mb-2 flex gap-2 items-center">
					<img
						src={`/icons/${type}.svg`}
						alt={config.label}
						className="w-8 h-8"
					/>
					{config.label} Configuration
				</h1>

				<div>
					<label htmlFor="credentials" className="text-foreground">
						Credentials:
					</label>
					<Select
						defaultValue={
							//savedData?.nodeId === nodeId ? savedData.data.at(-1)?.value : ""
							selectedCredentials
						}
						name="credentials"
						//	onValueChange={(value) => {
						//		if (value === "__add_new__") {
						//			setCredentialModal(true);
						//			return;
						//		}
						//		setSelectedCredentials(value)
						//	}}
						onValueChange={((value) => { setSelectedCredentials(value) })}
					>
						<SelectTrigger className="w-[220px]">
							<SelectValue placeholder="Select Credentials" />
						</SelectTrigger>
						<SelectContent>
							<div
								className="cursor-pointer px-2 py-1 text-base font-medium hover:bg-accent-foreground/20 rounded-md"
								onClick={() => setCredentialModal(true)}
							>
								+ Add Credentials
							</div>
							{credentials.map((c, i) => (
								<SelectItem
									key={i}
									value={c.service}
									className="cursor-pointer text-base"
								>
									{c.service}-{i + 1}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{type === "ai" && (
					<div>
						<label className="text-foreground mb-2 block">
							Tools:
						</label>
						<div className="flex flex-wrap gap-2">
							{availableTools.map((tool) => (
								<button
									key={tool}
									type="button"
									onClick={() => handleToolSelection(tool)}
									className={`px-3 py-1 rounded-lg border transition-colors ${selectedTools.includes(tool)
										? "bg-primary text-primary-foreground border-primary"
										: "bg-card text-foreground border-border hover:bg-muted"
										}`}
								>
									{tool}
								</button>
							))}
						</div>
						<p className="text-sm text-muted-foreground mt-1">
							Selected: {selectedTools.join(", ") || "None"}
						</p>
					</div>
				)}

				{/* Telegram Chat ID field - only show if telegram is selected */}
				{type === "ai" && selectedTools.includes("telegram") && (
					<div className="flex flex-col gap-2">
						<label className="text-foreground" htmlFor="chatId">
							Telegram Chat ID:
						</label>
						<input
							type="text"
							name="chatId"
							placeholder="Enter Telegram Chat ID"
							required
							className="border bg-card text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none shadow-sm"
						/>
					</div>
				)}

				{/* Dynamic Fields */}
				{config.formFields.map((field, i) => (
					<div className="flex flex-col gap-2">
						<label className="text-foreground" htmlFor={field.label}>
							{field.label}:
						</label>
						<input
							key={field.name}
							type={field.type}
							name={field.name}
							defaultValue={
								savedData?.data.length !== 0 ? savedData?.data[i].value : ""
							}
							placeholder={field.placeholder}
							required
							className="border bg-card text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none shadow-sm"
						/>
					</div>
				))}
				<Button
					className="w-fit"
					variant={"default"}
					type="submit"
					disabled={submitting}
					id="submit_btn"
				>
					{submitting ? (
						<div className="flex items-center gap-2">
							<Loader className="animate-spin" /> Submiting
						</div>
					) : (
						"Submit"
					)}
				</Button>
			</form>

			{credentialModal && (
				<CredentialModal
					service={config.label}
					open={credentialModal}
					credentialFields={type === "ai" ? dymanicCredentialFiels ? dymanicCredentialFiels : [] : config.credentials ? config.credentials : []}
					onOpenChange={setCredentialModal}
				/>
			)}
		</div>
	);
}
