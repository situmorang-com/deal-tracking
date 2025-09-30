<script>
  import { cn } from '$lib/utils';
  
  export let value = '';
  export let placeholder = '';
  export let disabled = false;
  export let rows = 4;
</script>

<textarea
  bind:value
  {placeholder}
  {disabled}
  {rows}
  class={cn(
    'flex w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-300',
    $$props.class
  )}
  on:input
  on:change
  on:focus
  on:blur
></textarea>