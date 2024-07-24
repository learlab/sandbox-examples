"use client";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { Context } from "./context";

const Editor = dynamic(
	() => import("@monaco-editor/react").then((mod) => mod.Editor),
	{ ssr: false, loading: () => <div>Loading ...</div> },
);

export const CodeEditor = () => {
	const { editorRef, initial } = useContext(Context);

	return (
		<Editor
			width="100%"
			className="min-h-[150px]"
			language="javascript"
			theme="light"
			onMount={(e) => {
				editorRef.current = e;
				e.setValue(initial);
			}}
			options={{
				autoIndent: "full",
				tabSize: 2,
				padding: {
					top: 10,
				},
				contextmenu: true,
				fontFamily: "PT Mono, monospace",
				fontSize: 18,
				lineHeight: 24,
				hideCursorInOverviewRuler: true,
				renderLineHighlight: "none",
				overviewRulerBorder: false,
				matchBrackets: "always",
				minimap: {
					enabled: false,
				},
				scrollbar: {
					verticalSliderSize: 8,
				},
				selectOnLineNumbers: true,
				lineNumbersMinChars: 2,
				roundedSelection: false,
				readOnly: false,
				cursorStyle: "line",
				automaticLayout: true,
			}}
		/>
	);
};
