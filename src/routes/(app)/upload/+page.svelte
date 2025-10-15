<script lang="ts">
	import { FileUpload } from '$lib/components/ui/file-upload';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import type { UploadResult } from '$lib/utils/storage';

	let uploadedFiles: UploadResult[] = $state([]);
	let multiple = true;

	// You'll need to configure Firebase app in your project
	// For now, we'll use a placeholder
	let firebaseApp: any = null;

	function handleFilesSelected(event: CustomEvent<{ files: File[] }>) {
		console.log('Files selected:', event.detail.files);
		toast.info(`${event.detail.files.length} file(s) selected`);
	}

	function handleUploadSuccess(event: CustomEvent<{ files: File[]; results: UploadResult[] }>) {
		console.log('Upload successful:', event.detail);
		uploadedFiles = [...uploadedFiles, ...event.detail.results];
		toast.success('Files uploaded successfully!');
	}

	function handleUploadError(event: CustomEvent<{ files?: File[]; results?: any[]; error?: any }>) {
		console.error('Upload error:', event.detail);
		toast.error('Some files failed to upload');
	}

	function handleFileRemoved(event: CustomEvent<{ file: File; index: number }>) {
		console.log('File removed:', event.detail);
		toast.info('File removed from selection');
	}

	function handleCleared() {
		console.log('All files cleared');
		toast.info('All files cleared');
	}

	function handleUploadStart(event: CustomEvent<{ files: File[] }>) {
		console.log('Upload started:', event.detail);
		toast.info('Upload started...');
	}

	function clearUploadedFiles() {
		uploadedFiles = [];
		toast.info('Uploaded files cleared');
	}
</script>

<div class="container mx-auto py-8 space-y-8">
	<div class="space-y-2">
		<h1 class="text-3xl font-bold">File Upload Demo</h1>
		<p class="text-muted-foreground">
			Test the file upload component with image resizing, compression, and Firebase Storage integration.
		</p>
	</div>

	<!-- File Upload Component -->
	<Card>
		<CardHeader>
			<CardTitle>Upload Files</CardTitle>
		</CardHeader>
		<CardContent>
			<FileUpload
				accept="image/*"
				{multiple}
				maxSize={5 * 1024 * 1024}
				maxFiles={5}
				imageProcessingOptions={{
					maxWidth: 1920,
					maxHeight: 1080,
					quality: 0.8,
					maxFileSize: 2 * 1024 * 1024
				}}
				{firebaseApp}
				uploadPath="demo-uploads"
				showPreview={true}
				onfilesSelected={handleFilesSelected}
				onuploadSuccess={handleUploadSuccess}
				onuploadError={handleUploadError}
				onfileRemoved={handleFileRemoved}
				oncleared={handleCleared}
				onuploadStart={handleUploadStart}
			/>
		</CardContent>
	</Card>

	<!-- Uploaded Files Display -->
	{#if uploadedFiles.length > 0}
		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
					<Button variant="outline" size="sm" onclick={clearUploadedFiles}>
						Clear All
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each uploadedFiles as file}
						<div class="border rounded-lg p-4 space-y-2">
							{#if file.type.startsWith('image/')}
								<img
									src={file.url}
									alt={file.name}
									class="w-full h-32 object-cover rounded"
								/>
							{:else}
								<div class="w-full h-32 bg-muted rounded flex items-center justify-center">
									<span class="text-2xl">📄</span>
								</div>
							{/if}
							<div class="space-y-1">
								<p class="text-sm font-medium truncate">{file.name}</p>
								<p class="text-xs text-muted-foreground">
									{(file.size / 1024).toFixed(1)} KB
								</p>
								<a
									href={file.url}
									target="_blank"
									rel="noopener noreferrer"
									class="text-xs text-primary hover:underline"
								>
									View File
								</a>
							</div>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	{/if}

	<!-- Usage Instructions -->
	<Card>
		<CardHeader>
			<CardTitle>Features</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
				<div class="space-y-2">
					<h4 class="font-medium">Image Processing</h4>
					<ul class="list-disc list-inside space-y-1 text-muted-foreground">
						<li>Automatic resizing to max dimensions (1920x1080)</li>
						<li>Compression to reduce file size</li>
						<li>Quality optimization (80% by default)</li>
						<li>Aspect ratio preservation</li>
					</ul>
				</div>
				<div class="space-y-2">
					<h4 class="font-medium">Upload Features</h4>
					<ul class="list-disc list-inside space-y-1 text-muted-foreground">
						<li>Drag and drop support</li>
						<li>Multiple file selection</li>
						<li>Real-time progress tracking</li>
						<li>Firebase Storage integration</li>
						<li>File validation and error handling</li>
					</ul>
				</div>
			</div>
		</CardContent>
	</Card>
</div>