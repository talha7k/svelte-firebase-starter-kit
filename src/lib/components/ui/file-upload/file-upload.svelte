<script lang="ts">
	import { Button } from '../button';
	import { Progress } from '../progress';
	import { Card, CardContent } from '../card';
	import { validateFile, resizeAndCompressImage, formatFileSize, type ImageProcessingOptions } from '$lib/utils';
	import { uploadFile, generateUploadPath, type UploadResult, type UploadProgress } from '$lib/utils/storage';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		accept?: string;
		multiple?: boolean;
		maxSize?: number;
		maxFiles?: number;
		imageProcessingOptions?: ImageProcessingOptions;
		disabled?: boolean;
		uploadPath?: string;
		showPreview?: boolean;
		firebaseApp?: any;
		onfilesSelected?: (event: CustomEvent<{ files: File[] }>) => void;
		onfileRemoved?: (event: CustomEvent<{ file: File; index: number }>) => void;
		oncleared?: (event: CustomEvent) => void;
		onuploadStart?: (event: CustomEvent<{ files: File[] }>) => void;
		onuploadSuccess?: (event: CustomEvent<{ files: File[]; results: UploadResult[] }>) => void;
		onuploadError?: (event: CustomEvent<{ files?: File[]; results?: any[]; error?: any }>) => void;
	}

	let {
		accept = 'image/*',
		multiple = false,
		maxSize = 10 * 1024 * 1024, // 10MB
		maxFiles = 1,
		imageProcessingOptions = {},
		disabled = false,
		uploadPath = 'uploads',
		showPreview = true,
		firebaseApp,
		onfilesSelected,
		onfileRemoved,
		oncleared,
		onuploadStart,
		onuploadSuccess,
		onuploadError
	}: Props = $props();

	let isDragging = $state(false);
	let files = $state<File[]>([]);
	let uploadProgress = $state<Record<string, number>>({});
	let uploadErrors = $state<Record<string, string>>({});
	let isUploading = $state(false);

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		
		if (disabled || isUploading) return;
		
		const droppedFiles = Array.from(e.dataTransfer?.files || []);
		processFiles(droppedFiles);
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const selectedFiles = Array.from(target.files || []);
		processFiles(selectedFiles);
	}

	async function processFiles(newFiles: File[]) {
		if (disabled || isUploading) return;

		// Check file count limit
		if (!multiple && newFiles.length > 1) {
			toast.error('Only one file is allowed');
			return;
		}

		if (files.length + newFiles.length > maxFiles) {
			toast.error(`Maximum ${maxFiles} files allowed`);
			return;
		}

		// Validate and process each file
		const validFiles: File[] = [];
		const errors: string[] = [];

		for (const file of newFiles) {
			const validation = validateFile(file, {
				maxSize,
				allowedTypes: accept.split(',').map(type => type.trim())
			});

			if (!validation.valid) {
				errors.push(`${file.name}: ${validation.error}`);
				continue;
			}

			// Process image files
			if (file.type.startsWith('image/')) {
				try {
					const processed = await resizeAndCompressImage(file, imageProcessingOptions);
					validFiles.push(processed.file);
				} catch (error) {
					errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Processing failed'}`);
				}
			} else {
				validFiles.push(file);
			}
		}

		if (errors.length > 0) {
			toast.error(errors.join('\n'));
		}

		if (validFiles.length > 0) {
			if (multiple) {
				files = [...files, ...validFiles];
			} else {
				files = validFiles;
			}
			
			onfilesSelected?.(new CustomEvent('filesSelected', { detail: { files: validFiles } }));
		}
	}

	function removeFile(index: number) {
		const removedFile = files[index];
		files = files.filter((_, i) => i !== index);
		delete uploadProgress[removedFile.name];
		delete uploadErrors[removedFile.name];
		onfileRemoved?.(new CustomEvent('fileRemoved', { detail: { file: removedFile, index } }));
	}

	function clearAll() {
		files = [];
		uploadProgress = {};
		uploadErrors = {};
		oncleared?.(new CustomEvent('cleared'));
	}

	async function uploadFiles() {
		if (files.length === 0 || isUploading || !firebaseApp) return;

		isUploading = true;
		onuploadStart?.(new CustomEvent('uploadStart', { detail: { files } }));

		try {
			const uploadPromises = files.map(async (file) => {
				try {
					const filePath = generateUploadPath(uploadPath, file.name);
					const result = await uploadFile(
						file,
						{
							firebaseApp,
							path: filePath,
							metadata: {
								contentType: file.type,
								customMetadata: {
									originalName: file.name,
									uploadedAt: new Date().toISOString()
								}
							}
						},
						(progress) => {
							uploadProgress[file.name] = progress.progress;
							uploadProgress = { ...uploadProgress };
						}
					);
					
					delete uploadErrors[file.name];
					return { file, result, success: true };
				} catch (error) {
					uploadErrors[file.name] = error instanceof Error ? error.message : 'Upload failed';
					return { file, error, success: false };
				}
			});

			const uploadResults = await Promise.all(uploadPromises);
			const successful = uploadResults.filter(r => r.success);
			const failed = uploadResults.filter(r => !r.success);

			if (successful.length > 0) {
				const successResults = successful.map(r => r.result).filter((r): r is UploadResult => r !== undefined);
				onuploadSuccess?.(new CustomEvent('uploadSuccess', { 
					detail: { 
						files: successful.map(r => r.file), 
						results: successResults 
					} 
				}));
				toast.success(`${successful.length} file(s) uploaded successfully`);
			}

			if (failed.length > 0) {
				onuploadError?.(new CustomEvent('uploadError', { 
					detail: { 
						files: failed.map(r => r.file), 
						results: failed 
					} 
				}));
				toast.error(`${failed.length} file(s) failed to upload`);
			}

			if (failed.length === 0) {
				clearAll();
			}
		} catch (error) {
			onuploadError?.(new CustomEvent('uploadError', { detail: { error } }));
			toast.error('Upload failed');
		} finally {
			isUploading = false;
		}
	}

	const canUpload = $derived(files.length > 0 && !isUploading && Object.values(uploadErrors).length === 0);
</script>

<div class="w-full space-y-4">
	<!-- Upload Area -->
	<div
		class="relative border-2 border-dashed rounded-lg p-6 text-center transition-colors {isDragging
			? 'border-primary bg-primary/5'
			: 'border-muted-foreground/25 hover:border-muted-foreground/50'} {disabled
			? 'opacity-50 cursor-not-allowed'
			: 'cursor-pointer'}"
		on:dragover={handleDragOver}
		on:dragleave={handleDragLeave}
		on:drop={handleDrop}
		role="button"
		tabindex="0"
		on:keydown={(e) => e.key === 'Enter' && !disabled && document.getElementById('file-input')?.click()}
	>
		<input
			id="file-input"
			type="file"
			{accept}
			{multiple}
			{disabled}
			class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
			on:change={handleFileSelect}
		/>
		
		<div class="space-y-2">
			<Icon icon="lucide:cloud-upload" class="mx-auto h-12 w-12 text-muted-foreground" />
			<div class="text-lg font-medium">Drop files here or click to browse</div>
			<div class="text-sm text-muted-foreground">
				{accept !== '*' ? `Accepted formats: ${accept}` : 'All file types accepted'}
				<br />
				Max size: {formatFileSize(maxSize)}
				{maxFiles > 1 ? ` • Max ${maxFiles} files` : ''}
			</div>
		</div>
	</div>

	<!-- File List -->
	{#if files.length > 0}
		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-medium">Selected Files ({files.length})</h3>
				{#if !isUploading}
					<Button variant="outline" size="sm" onclick={clearAll}>
						<Icon icon="lucide:x" class="h-4 w-4 mr-1" />
						Clear All
					</Button>
				{/if}
			</div>

			{#each files as file, index}
				<Card>
					<CardContent class="p-4">
						<div class="flex items-center space-x-4">
							<!-- File Preview -->
							{#if showPreview && file.type.startsWith('image/')}
								<div class="flex-shrink-0">
									<img
										src={URL.createObjectURL(file)}
										alt={file.name}
										class="h-16 w-16 object-cover rounded"
									/>
								</div>
							{:else}
								<div class="flex-shrink-0">
									<Icon icon="lucide:file" class="h-16 w-16 text-muted-foreground" />
								</div>
							{/if}

							<!-- File Info -->
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium truncate">{file.name}</p>
								<p class="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
								
								<!-- Upload Progress -->
								{#if uploadProgress[file.name] !== undefined}
									<div class="mt-2">
										<Progress value={uploadProgress[file.name]} class="h-2" />
										<p class="text-xs text-muted-foreground mt-1">
											{uploadProgress[file.name]}% uploaded
										</p>
									</div>
								{/if}

								<!-- Upload Error -->
								{#if uploadErrors[file.name]}
									<p class="text-xs text-destructive mt-1">{uploadErrors[file.name]}</p>
								{/if}
							</div>

							<!-- Actions -->
							<div class="flex-shrink-0">
								{#if !isUploading}
									<Button
										variant="ghost"
										size="sm"
										onclick={() => removeFile(index)}
										class="text-destructive hover:text-destructive"
									>
										<Icon icon="lucide:trash-2" class="h-4 w-4" />
									</Button>
								{/if}
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		<!-- Upload Button -->
		<div class="flex justify-end">
			<Button
				onclick={uploadFiles}
				disabled={!canUpload}
				class="min-w-32"
			>
				{#if isUploading}
					<Icon icon="lucide:loader-2" class="h-4 w-4 mr-2 animate-spin" />
					Uploading...
				{:else}
					<Icon icon="lucide:upload" class="h-4 w-4 mr-2" />
					Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
				{/if}
			</Button>
		</div>
	{/if}
</div>