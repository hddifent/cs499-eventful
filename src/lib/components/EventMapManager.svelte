<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	import MdiGenMap from 'virtual:icons/mdi/image-marker';
	import MdiDisMap from 'virtual:icons/mdi/image-check';
	import MdiArrowDown from 'virtual:icons/mdi/arrow-down';

	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import { BoothMapUploader } from '$lib/BoothMapUploader.svelte';

	interface ImgDimensions {
		w: number;
		h: number;
	}

	let {
		action = '?/saveEventMap',
		initialDisplayMapUrl = null,
		initialBoothData = null,
		message = ''
	} = $props();

	const maxFileSize = 5 * 1024 * 1024;

	let imgGenericPreviewURL: string | null = $state(null);
	let imgDisplayPreviewURL: string | null = $state(initialDisplayMapUrl);
	let imgGenericFile: File | null = $state(null);
	let imgDisplayFile: File | null = $state(null);

	const previewDisplay = $derived([
		{ label: 'Generic Map', imgURL: imgGenericPreviewURL },
		{ label: 'Display Map', imgURL: imgDisplayPreviewURL }
	]);

	let displayBoothImageElement: HTMLImageElement | null = $state(null);
	let imgNaturalWidth: number = $state(0);
	let imgNaturalHeight: number = $state(0);

	let boothMapUploader = new BoothMapUploader();
	if (initialBoothData) {
		boothMapUploader.processedMapData = initialBoothData;
	}
	let isSaving = $state(false);

	let uploadImgDimensions: (ImgDimensions | null)[] = $state([null, null]);
	let isUploadImgSameDimensions: boolean | null = $state(null);

	function getImgDimensions(src: string): Promise<ImgDimensions> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = src;
			img.onerror = reject;
			img.onload = () => {
				resolve({ w: img.naturalWidth, h: img.naturalHeight });
			};
		});
	}

	async function compareImages() {
		uploadImgDimensions = await Promise.all([
			imgGenericPreviewURL ? getImgDimensions(imgGenericPreviewURL) : Promise.resolve(null),
			imgDisplayPreviewURL ? getImgDimensions(imgDisplayPreviewURL) : Promise.resolve(null)
		]);

		if (uploadImgDimensions.some((item) => item === null)) {
			isUploadImgSameDimensions = null;
			return;
		}

		isUploadImgSameDimensions =
			uploadImgDimensions[0]?.w === uploadImgDimensions[1]?.w &&
			uploadImgDimensions[0]?.h === uploadImgDimensions[1]?.h;
	}

	const handleImageLoad = () => {
		if (displayBoothImageElement) {
			imgNaturalWidth = displayBoothImageElement.naturalWidth;
			imgNaturalHeight = displayBoothImageElement.naturalHeight;
		}
	};

	const handleSave: SubmitFunction = ({ formData }) => {
		isSaving = true;

		if (boothMapUploader.processedMapData) {
			formData.append('boothData', JSON.stringify(boothMapUploader.processedMapData));
		}

		return async ({ update }) => {
			isSaving = false;
			await update();
		};
	};

	$effect(() => {
		compareImages();
		if (imgGenericFile) {
			boothMapUploader.imgToUpload = imgGenericFile;
		}
	});
</script>

{#snippet uploadLabel(text: string)}
	<div class="flex items-center gap-2">
		<MdiArrowDown />
		<p>Upload your <span class="font-bold">{text}</span> image here.</p>
		<MdiArrowDown />
	</div>
{/snippet}

{#snippet genericUploadLabel()}
	{@render uploadLabel('generic map')}
{/snippet}

{#snippet displayUploadLabel()}
	{@render uploadLabel('display map')}
{/snippet}

{#snippet genericDropzoneIcon()}
	<MdiGenMap class="text-5xl" />
{/snippet}

{#snippet displayDropzoneIcon()}
	<MdiDisMap class="text-5xl" />
{/snippet}

<div class="space-y-4 rounded-lg bg-gray1 p-6 shadow-md">
	<div class="text-xl font-bold">Event Map Setup</div>

	<span class="flex w-full items-center justify-center">
		<hr class="w-full border border-fg/50" />
	</span>

	<form
		method="post"
		{action}
		use:enhance={handleSave}
		class="space-y-4"
		enctype="multipart/form-data"
	>
		<div class="flex gap-4">
			<div class="w-full">
				<ImageUpload
					{maxFileSize}
					bind:imgPreviewURL={imgGenericPreviewURL}
					label={genericUploadLabel}
					dropzoneIcon={genericDropzoneIcon}
					bind:uploadedFile={imgGenericFile}
				/>
			</div>
			<div class="w-full">
				<ImageUpload
					name="displayMap"
					{maxFileSize}
					bind:imgPreviewURL={imgDisplayPreviewURL}
					label={displayUploadLabel}
					dropzoneIcon={displayDropzoneIcon}
					bind:uploadedFile={imgDisplayFile}
				/>
			</div>
		</div>

		<!-- Image Preview -->
		<div class="flex gap-y-4">
			{#each previewDisplay as display, i (display.label)}
				<div class="flex w-full flex-col items-center justify-start gap-y-2">
					<p>
						--- {display.label}{!uploadImgDimensions[i]
							? ''
							: ` (${uploadImgDimensions[i].w} x ${uploadImgDimensions[i].h})`} ---
					</p>
					{#if display.imgURL}
						<img
							src={display.imgURL}
							alt="Uploaded Preview"
							class="h-auto w-3/4 max-w-xl bg-gray1 object-contain"
						/>
					{/if}
				</div>
			{/each}
		</div>

		{#if isUploadImgSameDimensions === false}
			<div class="w-full text-center text-error">
				Warning: Uploaded images have different dimensions. Booth mapping may be misaligned.
			</div>
		{/if}

		{#if boothMapUploader.uploadError}
			<div class="w-full text-center text-error">{boothMapUploader.uploadError}</div>
		{/if}

		<div class="flex items-center gap-4">
			{#if imgGenericFile && imgDisplayFile}
				<button
					type="button"
					class="w-full rounded-lg bg-primary px-4 py-2 font-bold shadow-md transition hover:bg-primary-hover disabled:opacity-50"
					onclick={() => boothMapUploader.processImage()}
					disabled={boothMapUploader.isProcessing}
				>
					{boothMapUploader.isProcessing ? 'Processing Map...' : 'Process Booths'}
				</button>
			{/if}
		</div>

		{#if !boothMapUploader.isProcessing && boothMapUploader.processedMapData && imgDisplayPreviewURL}
			{@const booths = Object.entries(boothMapUploader.processedMapData)}

			<span class="flex w-full items-center justify-center">
				<hr class="w-full border border-fg/50" />
			</span>

			<div class="text-lg font-bold">Map Preview ({booths.length} Booths Detected)</div>

			<div class="relative inline-block w-full overflow-hidden rounded-lg bg-bg shadow-inner">
				<img
					bind:this={displayBoothImageElement}
					src={imgDisplayPreviewURL}
					onload={handleImageLoad}
					class="h-auto w-full object-contain"
					alt="Interactive Event Map"
				/>

				{#if imgNaturalWidth > 0 && imgNaturalHeight > 0}
					{#each booths as [label, data] (label)}
						{@const [[x1, y1], [x2, y2]] = data.bounding_box}
						{@const left = (x1 / imgNaturalWidth) * 100}
						{@const top = (y1 / imgNaturalHeight) * 100}
						{@const width = ((x2 - x1) / imgNaturalWidth) * 100}
						{@const height = ((y2 - y1) / imgNaturalHeight) * 100}

						<button
							type="button"
							class="group absolute flex items-center justify-center bg-primary/25 text-sm font-bold text-fg transition-colors hover:bg-primary/75"
							style="left: {left}%; top: {top}%; width: {width}%; height: {height}%;"
							title="Booth {label}"
							onclick={() => {}}
						>
							<span class="opacity-0 transition-opacity group-hover:opacity-100"
								>{label}</span
							>
						</button>
					{/each}
				{/if}
			</div>

			<button
				type="submit"
				class="w-full rounded-lg bg-primary px-4 py-2 font-bold text-bg shadow-md transition hover:bg-primary-hover disabled:opacity-50"
				disabled={isSaving}
			>
				{isSaving ? 'Saving Map Data...' : 'Confirm & Save Map'}
			</button>
		{/if}
	</form>

	{#if message}
		<div class="mx-auto mt-2 w-max text-error">{message}</div>
	{/if}
</div>
