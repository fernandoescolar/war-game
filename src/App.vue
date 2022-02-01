<script setup lang="ts">
import Header from '@/components/Header.vue'
import Game from '@/components/Game.vue'
import About from '@/components/About.vue'
import Configure from './components/Configure.vue';
import Statistics from './components/Statistics.vue';
</script>

<template>
  <div class="app">
    <div class="wrapper">
      <Header />
      <main>
        <Game />
      </main>
    </div>
  </div>
  <About />
  <Configure />
  <Statistics />
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;

  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    max-width: 500px;
    margin: 0;
    padding: 0;
  }
}
</style>
