<script lang="ts">
  import Header from "./components/Header.svelte";
  import { Methods } from "./data";

  let method = $state("Lagrange");
  let methodIdx = $derived(Methods.indexOf(method))

  function changeMethod(m: string) {
    if (!Methods.includes(m)) return;

    method = m;
  }
</script>

<Header {changeMethod} />
<main>{method}</main>

<style></style>
