<script lang="ts">
  import { Progress } from '$lib/components/ui/progress';
  import Icon from '@iconify/svelte';

  interface Step {
    id: string;
    title: string;
    description: string;
    icon: string;
    completed: boolean;
  }

  let {
    currentStep = 0,
    steps = [
      {
        id: 'welcome',
        title: 'Welcome',
        description: 'Getting started',
        icon: 'lucide:user-plus',
        completed: false
      },
      {
        id: 'company-choice',
        title: 'Company Setup',
        description: 'Choose your path',
        icon: 'lucide:building-2',
        completed: false
      },
      {
        id: 'details',
        title: 'Details',
        description: 'Provide information',
        icon: 'lucide:file-text',
        completed: false
      },
      {
        id: 'complete',
        title: 'Complete',
        description: 'All set!',
        icon: 'lucide:check-circle',
        completed: false
      }
    ] as Step[]
  }: {
    currentStep?: number;
    steps?: Step[];
  } = $props();

  $effect(() => {
    // Mark steps as completed based on current step
    steps.forEach((step, index) => {
      step.completed = index < currentStep;
    });
  });

  let progressPercentage = $state(0);

  $effect(() => {
    progressPercentage = ((currentStep + 1) / steps.length) * 100;
  });
</script>

<div class="w-full space-y-4">
  <!-- Progress Bar -->
  <div class="space-y-2">
    <div class="flex justify-between text-sm text-muted-foreground">
      <span>Step {currentStep + 1} of {steps.length}</span>
      <span>{Math.round(progressPercentage)}% complete</span>
    </div>
    <Progress value={progressPercentage} class="w-full" />
  </div>

  <!-- Step Indicators -->
  <div class="flex justify-between">
    {#each steps as step, index}
      <div class="flex flex-col items-center space-y-2 flex-1">
        <!-- Step Circle -->
        <div
          class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
          class:border-primary={index <= currentStep}
          class:bg-primary={step.completed}
          class:border-muted-foreground={index > currentStep}
          class:bg-background={index > currentStep}
        >
          {#if step.completed}
            <Icon icon="lucide:check" class="w-5 h-5 text-primary-foreground" />
          {:else if index === currentStep}
            <Icon icon={step.icon} class="w-5 h-5 text-primary" />
          {:else}
            <Icon icon={step.icon} class="w-5 h-5 text-muted-foreground" />
          {/if}
        </div>

        <!-- Step Info -->
        <div class="text-center max-w-20">
          <div class="text-xs font-medium truncate">{step.title}</div>
          <div class="text-xs text-muted-foreground truncate">{step.description}</div>
        </div>
      </div>
    {/each}
  </div>
</div>