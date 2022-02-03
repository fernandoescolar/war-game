<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
// replaced dyanmicaly
const reloadSW: any = '__RELOAD_SW__'
const {
  offlineReady,
  needRefresh,
  updateServiceWorker,
} = useRegisterSW({
  immediate: true,
  onRegistered(r) {
    if (reloadSW === 'true') {
      r && setInterval(async() => {
        console.log('Checking for sw update')
        await r.update()
      }, 20000 /* 20s for testing purposes */)
    }
    else {
      console.log(`SW Registered: ${r}`)
    }
  },
})

const close = async() => {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
  >
    <div class="message">
      <span v-if="offlineReady">
        App ready to work offline
      </span>
      <span v-else>
        New version available, click on reload button to update.
      </span>
    </div>
    <button v-if="needRefresh" @click="updateServiceWorker()">
      Reload
    </button>
    <button @click="close">
      Close
    </button>
  </div>
</template>

<style lang="scss" scoped>
@import "../sass/variables";

.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 10px;
  margin: 16px;
  padding: 12px;
  border: 1px solid $lines;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0px $shadow;
  animation: fadein 0.5s;
  background-color: $background;

  .message {
    margin-bottom: 8px;
  }

  button {
    border: 1px solid $lines;
    outline: none;
    margin-right: 5px;
    border-radius: 2px;
    padding: 3px 10px;
    font-family: $title-font-family;
  }
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 10px; opacity: 1;}
}
</style>