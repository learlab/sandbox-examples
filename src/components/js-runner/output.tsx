"use client";
import { Console as LogOutput } from "@learlab/console";
import { useContext } from "react";
import { Context } from "./context";

export const Output = () => {
	const { logs } = useContext(Context);

	return (
		<LogOutput
			logs={logs}
			id="output"
			// @ts-ignore
			styles={{ BASE_FONT_SIZE: "14px" }}
			className="overflow-y-scroll h-64"
		/>
	);
};
