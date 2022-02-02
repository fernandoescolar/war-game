<template>
  <header>
    <button aria-label="configure" @click="ViewConfiguration()">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
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