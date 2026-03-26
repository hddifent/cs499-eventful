type BoothBoundingBox = {
	[key: string]: {
		bounding_box: [[number, number], [number, number]];
	};
};

export class BoothMapUploader {
	imgToUpload: File | null = $state(null);
	isProcessing: boolean = $state(false);
	processedMapData: BoothBoundingBox | null = $state(null);
	uploadError: string | null = $state(null);

	async processImage() {
		this.uploadError = null;

		if (!this.imgToUpload) {
			this.uploadError = 'No image to upload.';
			return;
		}

		this.isProcessing = true;

		const formData = new FormData();
		formData.append('file', this.imgToUpload);

		const res = await fetch('/api/map/process', {
			method: 'POST',
			body: formData
		});

		if (res.ok) {
			const data = await res.json();
			this.processedMapData = data;
			console.log($state.snapshot(this.processedMapData));
		} else {
			const errorData = await res.json().catch(() => ({}));
			this.uploadError = `Upload failed (${res.status}): ${errorData.detail || res.statusText}`;
		}

		this.isProcessing = false;
	}
}
