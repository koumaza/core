<script lang="ts">
	//#region Base
	import { DOMEventsForwarder } from "../src/actions";
	const forwardDOMEvents = DOMEventsForwarder();
	let className: string = undefined;

	export { className as class };
	export let style: string = undefined;
	export let id: string = undefined;

	export let dom: HTMLPreElement = undefined;

	import { BaseProps } from "./Props";
	export let props: BaseProps = {};
	//#endregion

	// Pre
</script>

<pre
	bind:this={dom}
	{...props}
	{id}
	class={className}
	{style}
	use:forwardDOMEvents>
  <slot />
</pre>
