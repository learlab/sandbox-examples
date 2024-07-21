import { Provider } from "./context";
import { Control } from "./control";
import { CodeEditor } from "./editor";
import { InlineEditor } from "./inline-editor";
import { Output } from "./output";
import { Runner } from "./runner";

export function JSRunner() {
	return (
		<Provider>
			<Runner />

			<div className="grid grid-cols-2 grid-rows-[1fr_40px] max-h-96 border-b border-t pt-4">
				<div className="col-span-1 row-span-2">
					<CodeEditor />
				</div>
				<div className="col-span-1 row-span-1">
					<Output />
				</div>
				<div className="col-span-1 row-span-1">
					<InlineEditor />
				</div>
			</div>

			<Control />
		</Provider>
	);
}
