<svelte:options immutable={true} />

<script context="module" lang="ts">
	let count = 0;
</script>

<script lang="ts">
	//#region Base
	import { parseClassList } from "../../common/functions";
	import { DOMEventsForwarder } from "../../common/actions";
	const forwardDOMEvents = DOMEventsForwarder();
	let className: string = undefined;

	export { className as class };
	export let style: string = undefined;
	export let id: string = `@smui/image-list/Image:${count++}`;

	export let dom: HTMLImageElement = undefined;

	import { BaseProps } from "../../common/dom/Props";
	export let props: BaseProps = {};
	//#endregion

	// Image
	export let src: string;
	export let alt: string = undefined;
</script>

<img
	bind:this={dom}
	{...props}
	{id}
	class={parseClassList([className, "mdc-image-list__image"])}
	{style}
	{src}
	{alt}
	use:forwardDOMEvents
/>
