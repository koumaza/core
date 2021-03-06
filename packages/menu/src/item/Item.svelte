<svelte:options immutable={true} />

<script context="module" lang="ts">
	let count = 0;
</script>

<script lang="ts">
	//#region import
	import { UseState } from "@raythurnevoid/svelte-hooks";
	import { Item } from "../internal/item";
	import { getMenuContext } from "..";
	import { Selectable } from "@raythurnevoid/svelte-group-components/ts/selectable";
	import { createEventDispatcher } from "svelte";
	import type { OnItemChangeEvent } from "./types";
	//#endregion

	//#region exports
	//#region base
	let className: string = undefined;
	export { className as class };
	export let style: string = undefined;
	export let id: string = `@smui/list/Item:${count++}`;
	export let dom: HTMLLIElement = undefined;
	//#endregion

	export let ripple: boolean = true;
	export let selected: boolean = false;
	export let disabled: boolean = false;
	export let tabindex: number = -1;
	export let value: any = undefined;
	export let ariaLabel: string = undefined;
	export let title: string = undefined;
	//#endregion

	//#region implementation
	const dispatch = createEventDispatcher<{
		change: OnItemChangeEvent;
	}>();

	const menuContext$ = getMenuContext();

	$: if ($menuContext$.selectionType && selected == null) {
		selected = false;
	}

	async function handleChange() {
		dispatch("change", { dom, selected });
	}
	//#endregion
</script>

<UseState value={ripple} onUpdate={() => $menuContext$.reinitialize()} />

<Selectable
	bind:selected
	group={$menuContext$.selectionGroup}
	{dom}
	{value}
	on:change={handleChange}
>
	<Item
		bind:dom
		{id}
		class={className}
		{style}
		{title}
		{tabindex}
		{selected}
		{value}
		{ariaLabel}
		{disabled}
		{ripple}
		{...$$restProps}
		let:leadingClassName
		let:trailingClassName
		on:click
		on:mousedown
		on:mouseup
		on:keydown
		on:keyup
		on:focus
		on:blur
		on:focusin
		on:focusout
	>
		<slot {selected} {leadingClassName} {trailingClassName} />
	</Item>
</Selectable>
