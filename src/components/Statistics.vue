<template>
  <Modal title="Statistics" :visible="statistics">
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

const { statistics } = mapGetters<ScreensState>('screens')

</script>
