<template>
  <Modal title="Configure" :visible="configuration">
        <p>Work in progresss</p>
        <p>...</p>
        <p>...</p>
        <p>...</p>
        <p>...</p>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import {  mapGetters, ScreensState } from '@/store'

const { configuration } = mapGetters<ScreensState>('screens')

</script>
