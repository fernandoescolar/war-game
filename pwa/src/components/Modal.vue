<template>
  <div :class="{ modal: true, hidden: !props.visible }">
    <div class="overlay"></div>
    <div class="container">
        <div class="header">
          <h1>{{ props.title }}</h1>
          <button v-if="props.showClose" @click="ViewGame()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="content">
            <slot></slot>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapActions, ScreensActions } from '@/store'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    required: true
  },
  showClose: {
    type: Boolean,
    default: true
  }
})
const { ViewGame } = mapActions<ScreensActions>('screens')
</script>

<style lang="scss">
@import "../sass/variables";

.modal {
  position: fixed;
  top: 0px;
  left: 0px;
  transition: opacity .25s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .container {
    position: relative;
    width: 100%;
    max-width: 500px;
    height: calc(100% - 2.8em);
    margin: 0.4em;
    background-color: $background;
    border-radius: 5px;
    box-shadow: 0px 0px 10px $shadow;
    padding: 1em;

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      widows: 100%;

      h1 {
        margin: 0;
        margin-right: 1em;
        width: calc(100% - 20px - 0.4em)
      }

      button {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    .content {
      overflow-y: auto;
      height: calc(100% - 50px);
      padding-top: 0.2em;
      padding-bottom: 0.2em;
    }
  }
}
</style>