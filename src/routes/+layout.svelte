<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import '@fontsource/google-sans';

	import { onMount } from 'svelte';

	import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();

	const themes = ['light', 'dark'];
	let themeIndex = 0;

	onMount(() => {
		const savedThemeIndex = localStorage.getItem('themeIndex');
		if (savedThemeIndex) {
			const parsedIndex = Number(savedThemeIndex.trim());
			themeIndex = isNaN(parsedIndex) ? 0 : parsedIndex;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			themeIndex = 1;
		}

		applyTheme();
	});

	const switchTheme = () => {
		themeIndex += 1;
		applyTheme();
	};

	function applyTheme() {
		themeIndex %= themes.length;
		document.documentElement.setAttribute('data-theme', themes[themeIndex]);
		localStorage.setItem('themeIndex', themeIndex.toString());
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<NavBar />

{@render children()}

<style>
	:global(body) {
		font-family: 'Google Sans', sans-serif;
	}
</style>
