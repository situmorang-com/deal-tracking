<script>
  import { cn } from '$lib/utils';
</script>

<label class={cn('text-sm font-medium leading-none text-white/90 peer-disabled:cursor-not-allowed peer-disabled:opacity-70', $$props.class)}>
  <slot />
</label>