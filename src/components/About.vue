<template>
  <Modal title="About..." :visible="about">
        <p>Modal content can go here</p>
        <p>...</p>
        <p>...</p>
        <p>...</p>
        <p>...</p>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import {  mapGetters, ScreensState } from '@/store'

const { about } = mapGetters<ScreensState>('screens')

</script>
