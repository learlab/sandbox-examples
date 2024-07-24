"use client";

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
import type { LogMessage } from "react-console-viewer";

type ContextType = {
	logs: LogMessage[];
	setLogs: Dispatch<SetStateAction<LogMessage[]>>;
	editorRef: MutableRefObject<editor.IStandaloneCodeEditor | null>;
	runnerRef: RefObject<HTMLIFrameElement>;
	runCode: (code?: string, source?: "editor" | "console") => void;
	initial: string;
	reset: () => void;
};

export const Context = createContext<ContextType>({} as ContextType);

type Props = {
	children: React.ReactNode;
	initial: string;
};

export const Provider = ({ children, initial }: Props) => {
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

	const reset = useCallback(() => {
		if (editorRef.current) {
			editorRef.current.setValue(initial);
		}
	}, []);

	return (
		<Context.Provider
			value={{
				logs,
				setLogs,
				editorRef,
				runnerRef,
				runCode,
				initial,
				reset,
			}}
		>
			{children}
		</Context.Provider>
	);
};
