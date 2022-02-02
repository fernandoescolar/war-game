<template>
  <Modal title="Start new game" :visible="configuration" :showClose="config.games.value > 0">
    <p>
      <label for="players">Number of players (<span class="accent">{{ numberOfPlayers }}</span>):</label>
      <input name="players" type="range" min="3" :max="maxPlayers" v-model="numberOfPlayers" />
    </p>
    <p>
      <label for="territories">Number of territories (<span class="accent">{{ numberOfAreas }}</span>):</label>
      <input name="territories" type="range" min="20" max="50" v-model="numberOfAreas" />
    </p>
    <p>
      <label for="initial-armies">Initial numer of player armies (<span class="accent">{{ initialArmies }}</span>):</label>
      <input name="initial-armies" type="range" min="10" max="40" v-model="initialArmies" />
    </p>
    <p>
      <label for="max-armies">Maximun number of armies in one territory (<span class="accent">{{ maxArmies }}</span>):</label>
      <input name="max-armies" type="range" min="5" max="20" v-model="maxArmies" />
    </p>
      <p>
      <label class="checkbox">Human player always first
        <input type="checkbox" v-model="humanPlayerAlwaysFirst">
        <span class="checkmark"></span>
      </label>
    </p>
    <p class="center">
      <button class="start-game" @click="startGame()">
        <span>Start game</span>
      </button>
    </p>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import {  mapGetters, mapActions, ScreensState, ConfigurationState, ConfigurationActions, ScreensActions } from '@/store'
import { ref } from 'vue'

const { configuration } = mapGetters<ScreensState>('screens')
const config = mapGetters<ConfigurationState>('configuration')

const maxPlayers = ref(config.colors.value.players.length),
      numberOfPlayers = ref(config.numberOfPlayers.value),
      numberOfAreas = ref(config.numberOfAreas.value),
      maxArmies = ref(config.maxArmies.value),
      initialArmies = ref(config.initialArmies.value),
      humanPlayerAlwaysFirst = ref(config.humanPlayerAlwaysFirst.value)

const { SetValue, StartNewGame } = mapActions<ConfigurationActions>('configuration')
const { ViewGame  } = mapActions<ScreensActions>('screens')
const startGame = () => {
  SetValue({
    numberOfPlayers: parseInt(numberOfPlayers.value.toString()),
    numberOfAreas: parseInt(numberOfAreas.value.toString()),
    maxArmies: parseInt(maxArmies.value.toString()),
    initialArmies: parseInt(initialArmies.value.toString()),
    humanPlayerAlwaysFirst: !!humanPlayerAlwaysFirst.value
  })
  StartNewGame()
  ViewGame()
}
</script>

<style lang="scss" scoped>
@import "../sass/variables";

p {
  margin-top: 1.5em;
}
.start-game {
    margin-top: 1em !important;
    height: 40px;
    border-radius: 12px;
    background-color: $accent;
    color: #000;
    border: none;
    padding: 0 20px;
    line-height: 20px;
    font-family: $font-family;
    font-size: $title-font-size;
    margin: auto;
}

.accent {
  color: $accent;
}
</style>