<template>
  <Modal title="About..." :visible="about">
    <p>Dev_Wars v. 1.0alpha</p>
    <p>This is an strategy game (similar to Risk) where you have to conquer enemy territory.</p>
    <p>
      The goal of the game is to conquer the entire map.
      Each territory has a number of armies. To attack you have to select your territory with at least 2 armies and then choose enemy territory.
      Who roll larger total number wins.
      In case of a tie, attacker looses.
      You can attack multiple times per turn.
      At the end of the turn, the player receives a number of armies according to number of territories and successful attacks.
      Armies are added randomly.
      To pass the move to the next player, click ">>" button.
    </p>
    <p>You can see the source code in the public repository in GitHub:</p>
    <p><a href="https://github.com/fernandoescolar/war-game" target="_blank">Source code</a></p>
    <p>
      This game has been developed by <a href="https://www.developerro.com/" target="_blank">Fernando Escolar</a>:
      <ul>
        <li><a href="https://twitter.com/fernandoescolar" target="_blank">Twitter</a></li>
        <li><a href="https://twitch.tv/fernandoescolar" target="_blank">Twitch</a></li>
        <li><a href="https://github.com/fernandoescolar" target="_blank">GitHub</a></li>
      </ul>
    </p>
    <p>If you enjoy it, please:</p>
    <p class="center">
    <button class="buy-me-a-beer center" @click="buyMeABeer()">
        <span>🍺 </span>
        <span> Buy me a beer</span>
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

<style lang="scss" scoped>
@import "../sass/variables";

.buy-me-a-beer {
    height: 40px;
    border-radius: 12px;
    background-color: #fd0;
    color: #fff;
    border: none;
    padding: 0 20px;
    line-height: 20px;
    font-family: $font-family;
    margin: auto;
}


</style>