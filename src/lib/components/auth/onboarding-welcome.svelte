<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/button/button.svelte';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import OnboardingProgress from './onboarding-progress.svelte';
  import Icon from '@iconify/svelte';

  let currentStep = $state(0);
  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to the Platform',
      description: 'Let\'s get you set up with your account and company.',
      icon: 'lucide:user-plus',
      completed: false
    },
    {
      id: 'choice',
      title: 'Choose Your Path',
      description: 'You can create a new company or join an existing one.',
      icon: 'lucide:building-2',
      completed: false
    }
  ];

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    } else {
      goto('/onboarding/company');
    }
  }

  function createCompany() {
    goto('/onboarding/create-company');
  }

  function joinCompany() {
    goto('/onboarding/join-company');
  }
</script>

<div class="w-full max-w-md space-y-6">
  <!-- Progress Indicator -->
  <OnboardingProgress {currentStep} {steps} />

  {#if currentStep < steps.length}
    <!-- Welcome Steps -->
    <Card class="p-6">
      <div class="text-center space-y-4">
        <div class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon icon={steps[currentStep].icon} class="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 class="text-2xl font-bold">{steps[currentStep].title}</h1>
          <p class="text-muted-foreground mt-2">{steps[currentStep].description}</p>
        </div>
        <Button onclick={nextStep} class="w-full">
          {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
        </Button>
      </div>
    </Card>
  {:else}
    <!-- Company Choice -->
    <Card class="p-6">
      <div class="text-center space-y-6">
        <div>
          <h1 class="text-2xl font-bold">Choose Your Path</h1>
          <p class="text-muted-foreground mt-2">How would you like to proceed?</p>
        </div>

        <div class="space-y-3">
          <Button onclick={createCompany} variant="default" class="w-full gap-2">
            <Icon icon="lucide:plus" class="w-4 h-4" />
            Create New Company
          </Button>

          <Button onclick={joinCompany} variant="outline" class="w-full gap-2">
            <Icon icon="lucide:users" class="w-4 h-4" />
            Join Existing Company
          </Button>
        </div>
      </div>
    </Card>
  {/if}
</div>