<script lang="ts">
	import MdiGenMap from 'virtual:icons/mdi/image-marker';
	import MdiDisMap from 'virtual:icons/mdi/image-check';
	import MdiArrowDown from 'virtual:icons/mdi/arrow-down';

	import ImageUpload from '$lib/components/ImageUpload.svelte';

	interface imgDimensions {
		w: number;
		h: number;
	}

	const maxFileSize = 5 * 1024 * 1024;
	let imgGenericPreviewURL: string | null = $state(null);
	let imgDisplayPreviewURL: string | null = $state(null);
	let imgGenericFile: File | null = $state(null);
	let imgDisplayFile: File | null = $state(null);

	const previewDisplay = $derived([
		{ label: 'Generic Map', imgURL: imgGenericPreviewURL },
		{ label: 'Display Map', imgURL: imgDisplayPreviewURL }
	]);

	let uploadImgDimensions: (imgDimensions | null)[] = $state([null, null]);
	let isUploadImgSameDimensions: boolean | null = $state(null);

	function getImgDimensions(src: string): Promise<imgDimensions> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.src = src;
			img.onerror = reject;

			img.onload = () => {
				resolve({
					w: img.naturalWidth,
					h: img.naturalHeight
				});
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

	async function uploadGenericMapImage() {
		if (!imgGenericFile) {
			return;
		}

		const formData = new FormData();
		formData.append('file', imgGenericFile);

		const res = await fetch('/map/process', {
			method: 'POST',
			body: formData
		});

		const data = await res.json();
		console.log(data);
	}

	$effect(() => {
		compareImages();
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

<div class="space-y-4 px-8 py-8">
	<div class="flex gap-y-4">
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
		{#each previewDisplay as display, i}
			<div class="flex w-full flex-col items-center justify-start gap-y-2">
				<p>
					--- {display.label}{uploadImgDimensions[i] === null
						? ''
						: ` (${uploadImgDimensions[i]!.w} x ${uploadImgDimensions[i]!.h})`} ---
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

	<!-- Same Size? -->
	{#if isUploadImgSameDimensions === false}
		<p class="text-error">
			Warning: Uploaded images have different dimensions. Proceed with caution.
		</p>
	{/if}

	<!-- Process Button -->
	{#if imgGenericFile !== null && imgDisplayFile !== null}
		<button class="bg-primary" onclick={uploadGenericMapImage}>Process Map</button>
	{/if}
</div>
