<svelte:options immutable={true} />

<script lang="ts">
	//#region  imports
	import { Graphic } from "../../../common/components";
	import type { GraphicType } from "../../../common/components";
	import { parseClassList } from "../../../common/functions";
	import type { IconDOM } from "..";
	//#endregion

	//#region exports
	//#region base
	let className: string = undefined;

	export { className as class };
	export let style: string = undefined;
	export let id: string = undefined;
	export let dom: IconDOM = undefined;
	//#endregion

	export let type: GraphicType = "icon";
	//#endregion

	//#region implementation
	//#endregion
</script>

<Graphic
	bind:dom
	{...$$restProps}
	{id}
	class={parseClassList([
		className,
		"mdc-tab__icon",
		[type === "icon" && className == undefined, "material-icons"],
	])}
	{style}
	{type}
>
	<slot />
</Graphic>
