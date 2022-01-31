<script setup lang="ts">
import Header from '@/components/Header.vue'
import Game from '@/components/Game.vue'
import About from '@/components/About.vue'
</script>

<template>
  <div class="dark:bg-dark dark:text-neutral-100 min-h-full">
    <div class="wrapper container mx-auto flex flex-col w-full max-w-lg">
      <Header />
      <main class="flex flex-auto justify-center items-center">
        <Game />
      </main>
    </div>
  </div>
  <About />
</template>

<style lang="scss">

</style>
