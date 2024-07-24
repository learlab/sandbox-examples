import { Provider } from "./context";
import { Control } from "./control";
import { CodeEditor } from "./editor";
import { InlineEditor } from "./inline-editor";
import { Output } from "./output";
import { Runner } from "./runner";

const initialCode = `console.log("hello world");
console.info(Math.min)
for (let i = 0; i < 10; i++) {
 console.warn(1)
}
console.log({a: 1, b: 2})
`;

export function JSRunner() {
	return (
		<Provider initial={initialCode}>
			<div className="grid gap-1">
				<Runner />

				<Control />
				<div className="flex flex-col">
					<div className="border-b pb-4">
						<CodeEditor />
					</div>
					<Output />
					<InlineEditor />
				</div>
			</div>
		</Provider>
	);
}
