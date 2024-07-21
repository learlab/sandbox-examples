"use client";

import { LogMessage } from "@learlab/console";
import type { editor } from "monaco-editor";
import {
	Dispatch,
	MutableRefObject,
	RefObject,
	SetStateAction,
	createContext,
	useCallback,
	useRef,
	useState,
} from "react";

type ContextType = {
	logs: LogMessage[];
	setLogs: Dispatch<SetStateAction<LogMessage[]>>;
	editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>;
	runnerRef: RefObject<HTMLIFrameElement>;
	runCode: (code?: string, source?: "editor" | "console") => void;
};

export const Context = createContext<ContextType>({} as ContextType);

export const Provider = ({ children }: { children: React.ReactNode }) => {
	const [logs, setLogs] = useState<LogMessage[]>([]);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const runnerRef = useRef<HTMLIFrameElement>(null);

	const runCode = useCallback(
		(code?: string, source: "editor" | "console" = "editor") => {
			if (runnerRef.current?.contentWindow) {
				const c = code || editorRef.current?.getValue() || "";
				runnerRef.current.contentWindow.postMessage(
					{ type: "run-code", code: c, source },
					"*",
				);
			}
		},
		[],
	);

	return (
		<Context.Provider
			value={{
				logs,
				setLogs,
				editorRef,
				runnerRef,
				runCode,
			}}
		>
			{children}
		</Context.Provider>
	);
};
