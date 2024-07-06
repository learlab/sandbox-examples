"use client";

import { Console, LogMessage } from "@learlab/console";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import prettier from "prettier";
import prettierPluginBabel from "prettier/plugins/babel";
import prettierPluginEstree from "prettier/plugins/estree";
import React, { useEffect, useRef, useState, useCallback } from "react";

const initialCode = `console.log("hello world");
console.table([1, 2, 3])
console.info(Math.min)
for (let i = 0; i < 10; i++) {
 console.warn(1)
}
console.log({a: 1, b: 2})
`;
export function JSRunner() {
	const iframe = useRef<HTMLIFrameElement>(null);
	const editor = useRef<editor.IStandaloneCodeEditor | null>(null);
	const [logs, setLogs] = useState<LogMessage[]>([]);

	const handleMessage = useCallback((event: MessageEvent) => {
		if (event.data && event.data.type === "log") {
			setLogs((prevLogs) => [...prevLogs, event.data.log]);
		}
	}, []);

	useEffect(() => {
		window.addEventListener("message", handleMessage);
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, [handleMessage]);

	const runCode = () => {
		if (iframe.current?.contentWindow) {
			const code = editor.current?.getValue() || "";
			setLogs([]);
			iframe.current.contentWindow.postMessage({ type: "run-code", code }, "*");
		}
	};

	return (
		<div className="editor-container">
			<Editor
				width="100%"
				height="60vh"
				language="javascript"
				theme="light"
				defaultValue={initialCode}
				onMount={(e) => {
					editor.current = e;
				}}
				options={{
					autoIndent: "full",
					tabSize: 2,
					padding: {
						top: 10,
					},
					contextmenu: true,
					fontFamily: "Menlo, Monaco, 'Courier New', monospace",
					fontSize: 18,
					lineHeight: 24,
					hideCursorInOverviewRuler: true,
					matchBrackets: "always",
					minimap: {
						enabled: false,
					},
					scrollbar: {
						horizontalSliderSize: 4,
						verticalSliderSize: 18,
					},
					selectOnLineNumbers: true,
					roundedSelection: false,
					readOnly: false,
					cursorStyle: "line",
					automaticLayout: true,
				}}
			/>
			<div className="flex gap-2">
				<button type="button" onClick={runCode} aria-label="Run code">
					Run
				</button>
				<button
					type="button"
					onClick={async () => {
						if (editor.current) {
							const code = editor.current.getValue();
							const result = await prettier.format(code, {
								parser: "babel",
								semi: false,
								plugins: [prettierPluginBabel, prettierPluginEstree],
							});
							editor.current.setValue(result);
							editor.current.focus();
						}
					}}
				>
					Format
				</button>
			</div>

			<iframe
				title="runner"
				id="runner"
				sandbox="allow-scripts"
				ref={iframe}
				className="hidden"
				srcDoc={iframeCode}
			/>
			<div className="console-output">
				{/* @ts-ignore */}
				<Console logs={logs} styles={{ BASE_FONT_SIZE: "20px" }} />
			</div>
		</div>
	);
}

const iframeCode = `
<html>
<head>
    <script>
        (function () {
            const originalConsole = { ...window.console };
            const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'clear', 'time', 'timeEnd', 'count', 'assert', 'command', 'result', 'dir'];
            methods.forEach(method => {
                console[method] = (...args) => {
                    originalConsole[method].apply(console, args);

                    window.parent.postMessage({
                        type: 'log',
                        log: {
                            method,
                            data: args.map(arg =>
                                arg instanceof Promise ? 'Promise { <pending> }' : typeof arg === 'object' ? JSON.parse(JSON.stringify(arg)) : typeof arg === 'function' ? arg.toString() : arg
                            )
                        }
                    }, '*');
                };
            });
        })();

  const geval = eval;
        window.addEventListener('message', async (event) => {
            if (event.data.type === 'run-code') {
                const { code } = event.data;
                try {

                    const result = geval('"use strict";\\n' + code )
     if (result !== undefined) {
      window.parent.postMessage({
       type: 'log',
       log: {
        method: 'return',
        data:  [typeof result === 'object' ? JSON.parse(JSON.stringify(result)) : typeof result === 'function' ? result.toString() : result]
       }
      }, '*');
     }
                } catch (error) {
                    console.error(error.toString());
                }
            }
        });
    </script>
</head>
<body><p>hello</p></body>
</html>
`;
