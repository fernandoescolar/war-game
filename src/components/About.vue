<template>
  <Modal title="About..." :visible="about">
        <p>Work in progresss</p>
        <p>...</p>
        <p>by Fernando Escolar:</p>
        <p><a href="https://twitter.com/fernandoescolar" target="_blank">@fernandoescolar</a></p>
        <p><a href="https://twitch.tv/fernandoescolar" target="_blank">fernandoescolar</a></p>
        <p>...</p>
        <p><a href="https://github.com/fernandoescolar/war-game" target="_blank">Source code</a></p>
        <p>...</p>
        <p>If you like it please:</p>
        <p>
        <button class="buy-me-a-beer flex flex-vert-center" @click="buyMeABeer()">
          <div class="flex">
            <span class="btn-icon">🍺 </span>
            <span class="btn-custom-text">Buy me a beer</span>
          </div>
        </button>
        </p>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import {  mapGetters, ScreensState } from '@/store'

const { about } = mapGetters<ScreensState>('screens')

const buyMeABeer = () => {
  window.open('https://www.buymeacoffee.com/fernandoescolar', '_blank')
}

</script>

<style lang="scss">
.buy-me-a-beer {
    height: 60px;
    border-radius: 12px;
    background-color: #fd0;
    color: #000;
    font-size: 32px;
    border: none;
    padding: 0 24px;
    line-height: 33px;
}

.flex-vert-center, .flex-both-center {
    align-items: center;
}
</style>