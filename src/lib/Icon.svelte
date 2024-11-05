<script lang="ts">
    let { src } = $props();
</script>

<svg>
    <use href={`${src}#icon`} />
</svg>
