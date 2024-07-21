"use client";
import { ArrowRightIcon } from "lucide-react";
import { useContext } from "react";
import { Context } from "./context";

export const InlineEditor = () => {
	const { runCode, setLogs } = useContext(Context);

	const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.shiftKey && e.key === "Enter") {
			e.preventDefault();
			const target = e.currentTarget;
			const start = target.selectionStart;
			const end = target.selectionEnd;
			const value = target.value;
			target.value = `${value.substring(0, start)}\n${value.substring(end)}`;
			target.selectionStart = target.selectionEnd = start + 1;
			return;
		}

		if (e.key === "l" && e.ctrlKey) {
			e.preventDefault();
			setLogs([]);
			return;
		}

		if (e.key === "Enter") {
			e.preventDefault();
			const output = document.querySelector("#output");
			console.log("output", output);
			if (output) {
				output.scrollTop = output.scrollHeight;
			}
			const code = e.currentTarget.value;
			runCode(code, "console");
			e.currentTarget.setSelectionRange(0, 0);
			e.currentTarget.value = "";
			return;
		}
	};

	return (
		<div className="flex items-center gap-1 border-t">
			<div className="flex items-center h-full">
				<ArrowRightIcon className="size-4" />
			</div>
			<textarea
				className="flex-1 h-[40px] p-[7px]"
				style={{ fontFamily: "PT Mono, monospace" }}
				onKeyDown={handleKeydown}
			/>
		</div>
	);
};
