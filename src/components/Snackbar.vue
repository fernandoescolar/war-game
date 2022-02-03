<template>
    <div id="snackbar" :class="{ show }">
        {{ title }}
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect} from 'vue'

const props = defineProps({
        title: {
            type: String,
            required: true
        },
        toggle: {
            type: Boolean,
            required: true
        }
        }),
      show = ref(false)

let firstTime = true
watchEffect(() => {
    const toggler = props.toggle.value
    if(firstTime) {
        firstTime = false
        return
    }

    setTimeout(() => show.value = toggler || true, 1)
    setTimeout(() => show.value = false, 3000)

})
</script>

<style lang="scss">
@import '../sass/variables';

#snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -150px;
  background-color: $text;
  color: $background;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;

    &.show {
        visibility: visible;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }
}

@keyframes fadein {
  from {bottom: 0; opacity: 0;}
  to {bottom: 30px; opacity: 1;}
}

@keyframes fadeout {
  from {bottom: 30px; opacity: 1;}
  to {bottom: 0; opacity: 0;}
}
</style>