"use client";

import prettier from "prettier";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import { useContext } from "react";
import { Context } from "./context";

export const Control = () => {
	const { editorRef, runCode } = useContext(Context);

	return (
		<div className="flex gap-2">
			<button type="button" onClick={() => runCode()} aria-label="Run code">
				Run
			</button>
			<button
				type="button"
				onClick={async () => {
					if (editorRef.current) {
						const code = editorRef.current.getValue();
						const result = await prettier.format(code, {
							parser: "babel",
							semi: false,
							plugins: [prettierPluginBabel, prettierPluginEstree],
						});
						editorRef.current.setValue(result);
						editorRef.current.focus();
					}
				}}
			>
				Format
			</button>
		</div>
	);
};
