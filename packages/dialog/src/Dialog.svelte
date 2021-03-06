<svelte:options immutable={true} />

<script lang="ts">
	//#region Base
	import { parseClassList } from "../../common/functions";
	import { DOMEventsForwarder } from "../../common/actions";
	const forwardDOMEvents = DOMEventsForwarder();
	let className: string = undefined;

	export { className as class };
	export let style: string = undefined;
	export let id: string = "";

	export let dom: HTMLDivElement = undefined;
	import { BaseProps } from "../../common/dom/Props";
	export let props: BaseProps = {};
	//#endregion

	// Dialog
	import { onMount, createEventDispatcher } from "svelte";
	import { createDialogContext } from "./DialogContext";
	import { memo } from "../../common/utils";
	import { MDCDialog, MDCDialogCloseEvent } from "@material/dialog";
	import { OnCloseEventDetail } from "./";

	export let escapeKeyAction = "close";
	export let scrimClickAction = "close";
	export let autoStackButtons = true;
	export let initialFocus: HTMLElement = null;
	export let open: boolean = false;
	export let ariaLabelledBy: string = undefined;
	export let ariaDescribedby: string = undefined;

	const dispatch = createEventDispatcher<{
		opened: undefined;
		closed: OnCloseEventDetail;
	}>();
	let mounted: boolean = false;

	let context$ = createDialogContext({
		isOpen: open,
		setTitleId(titleId) {
			ariaLabelledBy = titleId;
		},
		setContentId(contentTextId) {
			ariaDescribedby = contentTextId;
		},
	});

	$: $context$ = { ...$context$, isOpen: open };

	const openMemo = memo();
	$: if (mounted && openMemo.val !== open) {
		if (open) doOpen();
		else doClose();
	}

	onMount(() => {
		mounted = true;
	});

	let dialog: MDCDialog;

	$: dialog && (dialog.escapeKeyAction = escapeKeyAction);
	$: dialog && (dialog.scrimClickAction = scrimClickAction);
	$: dialog && (dialog.autoStackButtons = autoStackButtons);

	function setInitialFocusElement() {
		const currentInitalFocusElement = dom.querySelector(
			"[data-mdc-dialog-initial-focus]"
		);

		if (initialFocus && currentInitalFocusElement !== initialFocus) {
			removeInitialFocusAttr(currentInitalFocusElement);
			setInitialFocusAttr(initialFocus);
		}

		if (
			!initialFocus &&
			(!currentInitalFocusElement || !dom.contains(currentInitalFocusElement))
		) {
			const defaultAction = dom.querySelector(
				"[data-mdc-dialog-button-default]"
			);
			if (defaultAction) {
				removeInitialFocusAttr(currentInitalFocusElement);
				setInitialFocusAttr(defaultAction);
			}
		}
	}

	function setInitialFocusAttr(element: Element) {
		if (element) element.setAttribute("data-mdc-dialog-initial-focus", "");
	}

	function removeInitialFocusAttr(element: Element) {
		if (element) element.removeAttribute("data-mdc-dialog-initial-focus");
	}

	function handleDialogOpened() {
		if (!open) open = true;

		dispatch("opened");
	}

	function handleDialogClosed(event: MDCDialogCloseEvent) {
		if (open) open = false;

		dialog.destroy();
		dialog = null;

		dispatch("closed", event.detail);
	}

	export function doOpen() {
		if (dialog) return;

		open = true;
		openMemo.val = open;

		setInitialFocusElement();

		// I have to reinit dialog at every open because MDC doesn't listen for initialFocus element change
		dialog = new MDCDialog(dom);

		dialog.listen("MDCDialog:opened", handleDialogOpened);
		dialog.listen("MDCDialog:closed", handleDialogClosed);

		dialog.open();
	}

	export function doClose() {
		open = false;
		openMemo.val = open;

		dialog?.close();
	}

	export function isOpen() {
		return dialog?.isOpen;
	}

	export function layout() {
		return dialog?.layout();
	}
</script>

<div
	bind:this={dom}
	{...props}
	{id}
	class={parseClassList([className, "mdc-dialog"])}
	{style}
	role="alertdialog"
	aria-modal="true"
	aria-labelledby={ariaLabelledBy}
	aria-describedby={ariaDescribedby}
	use:forwardDOMEvents
>
	<div class="mdc-dialog__container">
		<div class="mdc-dialog__surface">
			<slot />
		</div>
	</div>
	<div class="mdc-dialog__scrim" />
</div>
