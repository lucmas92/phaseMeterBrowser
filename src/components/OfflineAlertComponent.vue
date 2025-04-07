<template>
  <Transition name="slide">
    <div v-if="message" :class="['banner', isOnline ? 'online' : 'offline']">
      {{ message }}
    </div>
  </Transition>
</template>
<style scoped>
/* Banner */
.banner {
  position: absolute;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Offline Banner */
.offline {
  background-color: #ff4d4d;
  color: white;
}

/* Online Banner */
.online {
  background-color: #4caf50;
  color: white;
}

/* Animazione slide-in e slide-out */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease-in-out;
}
.slide-enter-from {
  transform: translateY(-100%);
}
.slide-leave-to {
  transform: translateY(-100%);
}
</style>

<script setup>

import {onBeforeUnmount, onMounted, ref} from "vue";

const message = ref("");


onMounted(async () => {
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
});

onBeforeUnmount(() => {
  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
})


const isOnline = ref(navigator.onLine);

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
  message.value = isOnline.value ? "Sei di nuovo online!" : "⚠ Connessione persa! Sei offline.";

  if (isOnline.value) {
    setTimeout(() => {
      message.value = "";
    }, 3000);
  }
};
</script>
