<script lang="ts">
	import TopCard from '$lib/components/TopCard.svelte';
	import HomeBrowser from '$lib/components/HomeBrowser.svelte';

	import banner from '$lib/assets/bannner.png';
</script>

<TopCard
	imgSrc={banner}
	title="Welcome to EVENTFUL"
	desc="An all-in-one tool for event organizers and shoppers alike."
/>
<div class="py-8">
	<HomeBrowser />
</div>
