<svelte:options immutable={true} />

<script lang="ts">
	//#region  imports
	import { MDCList } from "@material/list";
	import type { MDCListActionEvent } from "@material/list";
	import {
		onDestroy,
		createEventDispatcher,
		onMount,
		tick,
		afterUpdate,
	} from "svelte";
	import type {
		SelectionGroupBinding,
		SelectionType,
	} from "@raythurnevoid/svelte-group-components/ts/selectable";
	import type { ListOrientation, ListItemsStyle } from "..";
	import { createListContext } from "..";
	import { List } from "../dom";
	import { Group } from "@raythurnevoid/svelte-group-components";
	import type { ItemContext } from "../item";
	import { UseState } from "@raythurnevoid/svelte-hooks";
	import type { OnListChildrenChangeEvent, OnListActionEvent } from "../types";
	import type { OnGroupItemsUpdateEvent } from "@raythurnevoid/svelte-group-components/ts";
	//#endregion

	//#region exports
	//#region base
	let className: string = undefined;
	export { className as class };
	export let style: string = undefined;
	export let id: string = undefined;
	export let dom: HTMLUListElement = undefined;
	//#endregion

	export let orientation: ListOrientation = "vertical";
	export let itemsStyle: ListItemsStyle = "textual";
	export let itemsRows: number = 1;
	export let dense: boolean = false;
	export let wrapFocus: boolean = false;
	export let typeahead: boolean = false;

	export let group: SelectionGroupBinding;
	// export let group: GroupBindings;
	export let selectionType: SelectionType = undefined;

	export let disableMDCInstance: boolean = false;
	//#endregion

	//#region implementation
	let list: MDCList;
	let listGroup: Group;
	let treeObserver: MutationObserver;

	const context$ = createListContext({
		listSelectionGroup: group,
		selectionType,
		reinitialize() {
			initialize();
		},
	});
	$: $context$ = {
		...$context$,
		dom,
		list,
		selectionType,
	};

	const dispatch = createEventDispatcher<{
		action: OnListActionEvent;
		optionsChange: OnListChildrenChangeEvent;
	}>();

	onMount(async () => {
		$context$ = { ...$context$, listGroup: listGroup.getBindings() };

		let treeObserverDebounce: number;
		treeObserver = new MutationObserver(() => {
			clearTimeout(treeObserverDebounce);
			treeObserverDebounce = setTimeout(() => {
				list?.layout();
			});
		});
		initTreeObserver();

		await tick();

		initialize();
	});

	onDestroy(() => {
		treeObserver?.disconnect();
		list?.destroy();
	});

	afterUpdate(() => {
		fixItemsTabIndex();
	});

	$: if (list) {
		if (
			orientation === "vertical" &&
			(!list.vertical == null || list.vertical === false)
		) {
			list.vertical = true;
		} else if (
			orientation === "horizontal" &&
			(list.vertical == null || list.vertical === true)
		) {
			list.vertical = false;
		}

		if (list.wrapFocus !== wrapFocus) {
			list.wrapFocus = wrapFocus;
		}

		if (list.hasTypeahead !== typeahead) {
			list.hasTypeahead = typeahead;
		}
	}

	async function initialize() {
		if (!disableMDCInstance) {
			list?.destroy();

			list = new MDCList(dom);
			list.listen("MDCList:action", handleAction);
		}
	}

	function getItems(): ItemContext[] {
		return listGroup?.getItems().map((item) => item.externalContext);
	}

	function fixItemsTabIndex() {
		// Fix tabindex using DOM API because i don't want Svelte to conflict with MDC.
		const items = getItems();
		if (items?.length) {
			if (
				!items.some(
					(item) => !item.disabled && getListItemStyledEl(item).tabIndex === 0
				)
			) {
				const firstEnabledItem = items.find((item) => !item?.disabled);
				if (firstEnabledItem) {
					getListItemStyledEl(firstEnabledItem).tabIndex = 0;
				}
				items.forEach((item) => {
					if (item !== firstEnabledItem) {
						getListItemStyledEl(item).tabIndex = -1;
					}
				});
			}
		}

		function getListItemStyledEl(item: ItemContext) {
			return item.dom.firstElementChild as HTMLDivElement | HTMLAnchorElement;
		}
	}

	async function handleAction(event: MDCListActionEvent) {
		const selectedItem = listGroup.getItems()[event.detail.index];
		dispatch("action", {
			dom,
			itemIndex: event.detail.index,
			itemDom: selectedItem.dom as HTMLLIElement,
			value: selectedItem.externalContext.value,
		});
	}

	function initTreeObserver() {
		treeObserver.disconnect();
		treeObserver.observe(dom, {
			childList: true,
			subtree: true,
		});
	}

	function handleOptionsChange(event: OnGroupItemsUpdateEvent) {
		list.hasTypeahead = true;
		dispatch("optionsChange", {
			dom,
			items: event.items.map((i) => i.dom as HTMLLIElement),
		});
	}
	//#endregion
</script>

<UseState value={dom} onUpdate={initTreeObserver} />

<Group
	bind:this={listGroup}
	on:optionsChange={(e) => handleOptionsChange(e.detail)}
>
	<List
		bind:dom
		{id}
		class={className}
		{style}
		{orientation}
		{itemsStyle}
		{itemsRows}
		{dense}
		aria-orientation={orientation}
		{...$$restProps}
		on:click
		on:mousedown
		on:mouseup
		on:keydown
		on:keyup
		on:focusin
		on:focusout
	>
		<slot />
	</List>
</Group>
