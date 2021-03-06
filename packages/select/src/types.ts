import { MDCSelectEventDetail } from "@material/select";

export type SelectVariant = "filled" | "outlined";
export interface OnSelectChangeEventDetail {
	value: string;
	dom: HTMLDivElement;
}
