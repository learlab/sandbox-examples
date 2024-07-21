"use client";
import { Editor } from "@monaco-editor/react";
import { useContext } from "react";
import { Context } from "./context";

const initialCode = `console.log("hello world");
console.info(Math.min)
for (let i = 0; i < 10; i++) {
 console.warn(1)
}
console.log({a: 1, b: 2})
`;

export const CodeEditor = () => {
	const { editorRef } = useContext(Context);

	return (
		<Editor
			width="100%"
			language="javascript"
			theme="light"
			defaultValue={initialCode}
			onMount={(e) => {
				editorRef.current = e;
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
				overviewRulerBorder: false,
				matchBrackets: "always",
				minimap: {
					enabled: false,
				},
				scrollbar: {
					verticalSliderSize: 8,
				},
				selectOnLineNumbers: true,
				roundedSelection: false,
				readOnly: false,
				cursorStyle: "line",
				automaticLayout: true,
			}}
		/>
	);
};
