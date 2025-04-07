<template>
  <div>
    <h1>{{ value }}</h1>
  </div>
</template>
<style>

h1 {
  font-size: clamp(86px, 30vw, 380px) !important;
  margin: 0;
  color: #FFFFFF;
}
</style>
<script setup>

import {useStore} from "vuex";
import {watch} from "vue";

const props = defineProps({
  value: Number
})

const store = useStore()

watch(
    () => props.value,
    () => {
      const limit = store.getters.limit
      const soundStatus = store.getters.soundStatus ?? false

      store.commit('setAlert', props.value > limit)

      if (soundStatus && props.value > limit) {
        playSound()
      }
    }
)


const playSound = () => {
  const audio = new Audio('/sound.mp3'); // Access via the public path
  audio.play();
}


</script>
