<template>
  <header>
    <button aria-label="configure" @click="ViewConfiguration()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M221.65723,34.34326A8.00246,8.00246,0,0,0,216,32h-.02539l-63.79883.20117A8.00073,8.00073,0,0,0,146.0332,35.106L75.6369,120.32275,67.31348,111.999A16.02162,16.02162,0,0,0,44.68555,112L32.001,124.68555A15.99888,15.99888,0,0,0,32,147.31348l20.88672,20.88769L22.94531,198.14258a16.01777,16.01777,0,0,0,.001,22.62695l12.28418,12.28418a16.00007,16.00007,0,0,0,22.62793,0L87.79883,203.1123,108.68652,224.001A16.02251,16.02251,0,0,0,131.31445,224L143.999,211.31445A15.99888,15.99888,0,0,0,144,188.68652l-8.32318-8.32324,85.21673-70.39648a8.00125,8.00125,0,0,0,2.90528-6.14258L224,40.02539A8.001,8.001,0,0,0,221.65723,34.34326ZM120,212.68652,99.11328,191.79883a16,16,0,0,0-22.62793,0L46.544,221.74023,34.25977,209.45605l29.9414-29.9414a16.01866,16.01866,0,0,0,0-22.62695L43.31445,136,56,123.31348l14.50165,14.50195.00116.001L94.34045,161.6543l.00232.00293.00251.00195L132.68555,200Zm87.81055-112.665-83.49829,68.97706L111.314,156l54.3432-54.34277a8.00053,8.00053,0,0,0-11.31446-11.31446L99.99994,144.686l-12.998-12.99854L155.97852,48.189l51.99609-.16357Z"/></svg>
    </button>
    <div>
      <h1>
      DEV_WARS
      </h1>
    </div>
    <div>
      <button aria-label="statistics" @click="ViewStatistics()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
      </button>
      <button aria-label="about" @click="ViewAbout()">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { mapActions, ScreensActions } from '@/store';

const {
    ViewConfiguration,
    ViewStatistics,
    ViewAbout
} = mapActions<ScreensActions>('screens');
</script>

<style lang="scss" scoped>
@import "../sass/variables";

header {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;

  h1 {
    font-family: $title-font-family;
    font-size: $title-font-size;
    margin-left: 0.5em;
    color: $text;
  }

  button {
    color: $text;
    padding: 0.4em;

    &:first-child {
      margin-left: 0.5em;
    }

    &:last-child {
      margin-right: 0.5em;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
}
</style>