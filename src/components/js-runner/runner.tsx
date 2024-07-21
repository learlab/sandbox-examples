"use client";
import { useCallback, useContext, useEffect } from "react";
import { Context } from "./context";

export const Runner = () => {
	const { runnerRef, setLogs } = useContext(Context);
	const handleMessage = useCallback((event: MessageEvent) => {
		if (event.data && event.data.type === "log") {
			if (Array.isArray(event.data.log)) {
				setLogs((prevLogs) => [...prevLogs, ...event.data.log]);
			} else {
				setLogs((prevLogs) => [...prevLogs, event.data.log]);
			}
		}
	}, []);

	useEffect(() => {
		window.addEventListener("message", handleMessage);
		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, [handleMessage]);

	return (
		<iframe
			title="runner"
			id="runner"
			sandbox="allow-scripts"
			ref={runnerRef}
			className="hidden"
			srcDoc={code}
		/>
	);
};

const code = `
<html>

<head>
    <script>
        let currentCode = null;
        (function () {
            const originalConsole = { ...window.console };
            const methods = [
                "log",
                "debug",
                "info",
                "warn",
                "error",
                "table",
                "clear",
                "time",
                "timeEnd",
                "count",
                "assert",
                "command",
                "result",
                "dir",
            ];
            methods.forEach((method) => {
                console[method] = (...args) => {
                    originalConsole[method].apply(console, args);

                    window.parent.postMessage(
                        {
                            type: "log",
                            log: {
                                method,
                                data: args.map((arg) =>
                                    arg instanceof Promise
                                        ? "Promise { <pending> }"
                                        : typeof arg === "object"
                                            ? JSON.parse(JSON.stringify(arg))
                                            : typeof arg === "function"
                                                ? arg.toString()
                                                : arg
                                ),
                            },
                        },
                        "*"
                    );
                };
            });
        })();

        const geval = eval;
        window.addEventListener("message", async (event) => {
            if (event.data.type === "run-code") {
                const { code, source } = event.data;
                currentCode = code
                window.parent.postMessage(
                    {
                        type: "log",
                        log: [
                            {
                                method: source === "editor" ? "source-editor" : "source-console",
                                data: [code],
                            },
                        ],
                    },
                    "*"
                );

                try {
                    const result =  eval?.(code);


                    if (result !== undefined && result !== "use strict") {
                        window.parent.postMessage(
                            {
                                type: "log",
                                log:
                                {
                                    method: "return",
                                    data: [
                                        typeof result === "object"
                                            ? JSON.parse(JSON.stringify(result))
                                            : typeof result === "function"
                                                ? result.toString()
                                                : result,
                                    ],
                                },
                            },
                            "*"
                        );
                    }
                } catch (error) {
                    console.error(error.toString());
                }
            }
        });
    </script>
</head>

<body></body>

</html>
`;
