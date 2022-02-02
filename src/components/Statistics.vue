<template>
  <Modal title="Statistics" :visible="statistics">
    <div v-if="statistics">
        <p v-for="(player, index) in players" :key="index">
          <span :style="{ color: player.color}">{{ player.name }}</span>
          <span v-if="player.alive"> ❤</span>
          <span v-if="!player.alive"> 💀</span>
          <br />
          <table>
            <tr>
              <td>👊</td>
              <td>moves</td>
              <td>{{ player.moves }}</td>
            </tr>
            <tr>
              <td>🙌</td>
              <td>victories</td>
              <td>{{ player.successfulMoves }}</td>
            </tr>
            <tr>
              <td>📈</td>
              <td>ratio</td>
              <td>
                <span v-if="player.successfulMoves === 0">0%</span>
                <span v-if="player.successfulMoves > 0">{{ Math.floor(player.successfulMoves * 100 / player.moves) }}%</span>
              </td>
            </tr>
          </table>
          <hr />
        </p>
        <p>
          ⏱ {{ time }}
        </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import {  mapGetters, ScreensState, GameState } from '@/store'
import { computed, ref } from '@vue/runtime-core';

const { statistics } = mapGetters<ScreensState>('screens')
const { players, startDate, winDate, looseDate } = mapGetters<GameState>('game')


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
  tr {
    td {
      padding: 0 0.5rem;

      &:last-child {
        text-align: right;
      }
    }
  }
}
</style>