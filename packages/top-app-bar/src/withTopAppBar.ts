export function withTopAppBar(node) {
	node.classList.add("mdc-top-app-bar--fixed-adjust");

	return {
		destroy() {
			node.classList.remove("mdc-top-app-bar--fixed-adjust");
		},
	};
}
