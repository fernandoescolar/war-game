<script setup lang="ts">
import PwaStatus from '@/components/PwaStatus.vue'
import Header from '@/components/Header.vue'
import Game from '@/components/Game.vue'
import About from '@/components/About.vue'
import Configure from '@/components/Configure.vue'
import Statistics from '@/components/Statistics.vue'
import Win from '@/components/Win.vue'
import { ConfigurationState, mapGetters } from '@/store'

const { games } = mapGetters<ConfigurationState>('configuration')
</script>

<template>
  <div class="app">
    <div class="wrapper">
      <Header />
      <main>
        <Game v-if="games > 0" :key="games"/>
      </main>
    </div>
    <PwaStatus />
  </div>
  <About />
  <Configure />
  <Statistics />
  <Win></Win>
</template>

<style lang="scss" scoped>
:root {
   --app-height: 100%;
}
.app {
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
   /* mobile viewport bug fix */
  min-height: -webkit-fill-available;
  height: var(--app-height);
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
