import { LogMessage } from "@learlab/console";
import { expose } from "comlink";

let logs: LogMessage[] = [];
const originalConsole = { ...console };

const serialize = (arg: any) => {
	return arg instanceof Promise
		? "Promise { <pending> }"
		: typeof arg === "object"
			? JSON.parse(JSON.stringify(arg))
			: typeof arg === "function"
				? arg.toString()
				: arg;
};

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
] as const;

methods.forEach((method) => {
	// @ts-ignore
	console[method] = (...args) => {
		originalConsole[method].apply(console, args);
		logs.push({ method, data: args.map(serialize) });
	};
});

const workerApi = {
	run: (code: string) => {
		logs = [];
		// biome-ignore lint/security/noGlobalEval: <explanation>
		const geval = eval;

		try {
			const result = geval(`"use strict";\n${code}`);
			logs.push({
				method: "return",
				data: [serialize(result)],
			});
			return { data: logs, error: null };
		} catch (error) {
			logs.push({ method: "error", data: [error] });
			return { data: logs, error };
		}
	},
};

export type WorkerApi = typeof workerApi;

expose(workerApi);
