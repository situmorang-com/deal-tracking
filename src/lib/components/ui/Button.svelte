<script lang="ts">
  let { 
    children, 
    variant = 'default',
    size = 'default',
    class: className = '',
    ...props 
  }: {
    children?: any;
    variant?: string;
    size?: string;
    class?: string;
    [key: string]: any;
  } = $props();
</script>

<button
  class={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${className}`}
  {...props}
>
  {@render children?.()}
</button>
