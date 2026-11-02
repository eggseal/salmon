<script lang="ts">
  import { Methods } from "../data";

  interface Props {
    changeMethod: (m: string) => void;
  }

  interface Category {
    name: string;
    methods: string[];
  }

  const { changeMethod }: Props = $props();

  const Categories: Category[] = [
    {
      name: "Non-Linear Equations",
      methods: Methods.slice(0, 7),
    },
    {
      name: "Linear Equations",
      methods: Methods.slice(7, 10),
    },
    {
      name: "Interpolation Algorithms",
      methods: Methods.slice(10),
    },
  ];

  let openBurger = $state(false);
  let openDropdown = $state<string | null>(null);

  function changeMethodAndClose(method: string) {
    changeMethod(method);
    openDropdown = null;
    openBurger = false;
  }
</script>

{#snippet NavCategories()}
  {#each Categories as category}
    <div
      class="nav-dropdown"
      onmouseenter={() => openBurger || (openDropdown = category.name)}
      onmouseleave={() => openBurger || (openDropdown = null)}
      role="navigation"
    >
      <button
        onclick={() =>
          (openDropdown =
            openBurger && openDropdown === category.name ? null : category.name)}
      >
        {category.name} <span class="drop-arrow">⚠️</span>
      </button>
      {#if openDropdown === category.name}
        <div class="nav-list">
          {#each category.methods as method}
            <button
              class="nav-item"
              onclick={() => changeMethodAndClose(method)}
            >
              {method}
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
{/snippet}

<header>
  <div class="header-wrapper">
    <div class="brand-wrapper">
      <h1 class="header-title">SALMON</h1>
    </div>
    <nav class="top-navbar">
      {@render NavCategories()}
    </nav>
    <nav class="burger-nav">
      <button class="burger-btn" onclick={() => (openBurger = !openBurger)}>
        ☰
      </button>
      {#if openBurger}
        <div class="burger-panel">
          {@render NavCategories()}
        </div>
      {/if}
    </nav>
  </div>
</header>

<style>
  header {
    padding: 0.5rem;
    height: 4.5rem;
    width: 100%;
  }
  .header-wrapper {
    display: flex;
    padding: 0.5rem;
    border-bottom: 1px solid var(--accent);
  }
  .brand-wrapper {
    flex: 0 1 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--accent);
  }
  .header-title {
    margin: 0;
    font-weight: 500;
  }

  nav {
    flex: 1 1 auto;
    display: flex;
    justify-content: right;
    gap: 1rem;
  }
  .nav-dropdown {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .nav-dropdown > button {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    color: var(--fg-300);
    background-color: transparent;
    border: none;
    font-size: 1rem;
    letter-spacing: 1px;
  }
  .drop-arrow {
    display: block;
    transform: rotate(180deg);
    filter: brightness(0) invert(0.5);
    transition: 150ms ease-in-out;
  }
  .nav-dropdown:has(.nav-list) .drop-arrow {
    transform: rotate(0);
  }

  .nav-list {
    position: absolute;
    top: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem 0.5rem;
    width: 100%;
    background-color: black;
    border: 1px solid var(--accent);
    border-radius: var(--b-rad);
  }
  .nav-item {
    cursor: pointer;
    color: var(--fg-500);
    padding: 0.5rem;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--bg-500);
    font-size: 1rem;
    text-align: left;
    transition: 150ms ease-in-out;
  }
  .nav-item:hover {
    border-bottom-color: var(--accent);
  }

  .burger-nav {
    display: none;
  }
  .top-navbar {
    display: flex;
  }

  .burger-btn {
    cursor: pointer;
    padding: 0 1rem;
    color: var(--accent);
    background-color: transparent;
    border: none;
    font-size: 1.25rem;
  }
  .burger-panel {
    position: absolute;
    top: 4.5rem;
    bottom: 0;
    left: 20%;
    right: 0;
    background-color: black;
    border: 1px solid var(--accent);
    border-right: none;
    border-radius: var(--b-rad) 0 0 var(--b-rad);
    transition: 150ms ease-in-out;
  }
  .burger-panel .nav-dropdown > button {
    padding: 1rem;
    width: 100%;
    text-align: left;
    align-items: flex-start;
    justify-content: left;
  }
  .burger-panel .nav-list {
    position: relative;
    border: none;
  }

  @media (width < 60rem) {
    .burger-nav {
      display: flex;
    }
    .top-navbar {
      display: none;
    }
  }
</style>
