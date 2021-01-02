import { A, Button } from "../../common/dom";

export type ButtonComponent = typeof Button | typeof A;
export type ButtonVariant = "default" | "raised" | "unelevated" | "outlined";
export type ButtonColor = "primary" | "secondary";
