<template>
  <Modal title="Statistics" :visible="statistics">
    <div v-if="statistics">
        <p>
          <table>
            <tr>
              <th></th>
              <th></th>
              <th>💥</th>
              <th>✌</th>
              <th>📈</th>
            </tr>
            <tr v-for="(player, index) in players" :key="index">
              <td>
                <span :style="{ color: player.color}">{{ player.name }}</span>
              </td>
              <td>
                <span v-if="player.alive"> ❤</span>
                <span v-if="!player.alive"> 💀</span>
              </td>
              <td>{{ player.moves }}</td>
              <td>{{ player.successfulMoves }}</td>
              <td>
                <span v-if="player.successfulMoves === 0">0%</span>
                <span v-if="player.successfulMoves > 0">{{ Math.floor(player.successfulMoves * 100 / player.moves) }}%</span>
              </td>
            </tr>
          </table>
        </p>
        <p class="centered">
          ⏱ {{ time }}
        </p>
        <div v-if="showHistory">
          <p>
            <b>History:</b>
          </p>
          <p v-for="line, index in lines" :key="index">
              <span v-html="line"></span>
              <hr />
          </p>
          <p>
            <a href="#" @click="showHistory = false">hide history</a>
          </p>
        </div>
        <div v-else>
          <p>
            <a href="#" @click="showHistory = true">show history</a>
          </p>
        </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import {  mapGetters, ScreensState, GameState, HistoryState } from '@/store'
import { computed, ref } from '@vue/runtime-core';

const showHistory = ref(false)
const { statistics } = mapGetters<ScreensState>('screens')
const { players, startDate, winDate, looseDate } = mapGetters<GameState>('game')
const { lines } = mapGetters<HistoryState>('history')

// convert date diff to string
const dateDiffToString = (dateDiff: number) => {
  const seconds = Math.floor(dateDiff % 60)
  const minutes = Math.floor(dateDiff / 60) % 60
  const hours = Math.floor(dateDiff / 3600) % 24
  const days = Math.floor(dateDiff / 86400)
  let result = ''
  if (days > 0) {
    result += `${days}d `
  }
  if (days > 0 || hours > 0) {
    result += `${hours}h `
  }
  result += ` ${minutes}m ${seconds}s`
  return result
}

let currentDate = ref(new Date())

const time = computed(() => {
  const diff = currentDate.value.getTime() - startDate.value.getTime()
  return dateDiffToString(diff / 1000)
})

setInterval(() => {
  currentDate.value = new Date()
}, 1000)
</script>


<style lang="scss" scoped>
table {
  width: 100%;
  td, th {
    padding: 0 0.5rem;
    text-align: right !important;

    &:first-child {
      text-align: left !important;
    }
  }
}

.centered {
  text-align: center;
}
</style>