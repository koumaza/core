<script lang="ts">
	//#region Base
	import { DOMEventsForwarder } from "../../common/events";
	const forwardDOMEvents = DOMEventsForwarder();
	let className = "";
	export { className as class };
	export let style: string = undefined;
	export let id: string = undefined;

	export let dom: HTMLDivElement = null;

	import { BaseProps } from "../../common/dom/Props";
	export let props: BaseProps = {};
	//#endregion

	// Text
	import { Icon } from "../../common/dom";
</script>

<svelte:options immutable={true} />

<Icon
	bind:dom
	{props}
	{id}
	class="mdc-banner__icon {className || 'material-icons'}"
	{style}
	on:domEvent={forwardDOMEvents}>
	<slot />
</Icon>
