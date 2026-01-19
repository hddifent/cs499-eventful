<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onDestroy } from 'svelte';

	import MdiImage from 'virtual:icons/mdi/image';

	import { FileUpload } from 'melt/builders';

	interface FileUploadData {
		maxFileSize?: number;
		label?: Snippet;
		dropzoneIcon?: Snippet;
		dropzoneLabel?: string;
		imgPreviewURL?: string | null;
		uploadedFile?: File | null;
	}

	let {
		maxFileSize = $bindable(5 * 1024 * 1024), // 5 MB
		label,
		dropzoneIcon,
		dropzoneLabel = 'Click to upload or drag and drop',
		imgPreviewURL = $bindable(null),
		uploadedFile = $bindable(null)
	}: FileUploadData = $props();

	const handleFileChange = (file: File) => {
		if (!file) {
			return;
		}
		if (imgPreviewURL) {
			URL.revokeObjectURL(imgPreviewURL);
			uploadedFile = file;
		}
		imgPreviewURL = URL.createObjectURL(file);
	};

	const fileUpload = new FileUpload({
		accept: '.png, .jpg, .jpeg',
		maxSize: maxFileSize,
		onAccept: handleFileChange,
		multiple: false
	});

	onDestroy(() => {
		if (imgPreviewURL) {
			URL.revokeObjectURL(imgPreviewURL);
		}
	});
</script>

{#snippet defaultLabel()}
	<p>Upload an image</p>
{/snippet}

{#snippet defaultDropzoneIcon()}
	<MdiImage class="text-5xl" />
{/snippet}

<!-- Melt File Input -->
<div class="flex flex-col items-center gap-4">
	<!-- Label -->
	{@render (label ?? defaultLabel)()}

	<!-- Dropzone -->
	<input {...fileUpload.input} />
	<div
		{...fileUpload.dropzone}
		class="flex w-3/4 max-w-xl flex-col items-center justify-center gap-y-2 rounded-lg border-4 border-dotted border-primary/50 bg-gray1 py-16 text-fg/50 hover:cursor-pointer"
	>
		{@render (dropzoneIcon ?? defaultDropzoneIcon)()}
		{#if fileUpload.isDragging}
			<p>Drop files here</p>
		{:else}
			<p>{dropzoneLabel}</p>
		{/if}
	</div>
</div>
