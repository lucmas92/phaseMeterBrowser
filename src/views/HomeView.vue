<template>
  <div class="home" :class="{'bg-danger': showAlert, 'bg-default': !showAlert}">
    <div class="error bg-danger" v-if="error">
      Errore nella richiesta!
    </div>
    <SettingsComponent/>
    <button
        style="position:absolute; z-index: 10; right:10rem; top:1rem; background-color: transparent; border: none; color: white"
        @click="goFullscreen">
      <i class="fa-solid  fa-3x fa-up-right-and-down-left-from-center"></i>
    </button>
    <button
        style="position:absolute; z-index: 10; right:6rem; top:1rem; background-color: transparent; border: none; color: white"
        @click="forceFetchData">
      <i class="fa-solid fa-3x fa-rotate"></i>
    </button>
    <div id="main" v-if="chartData.length > 0">
      <BarChartComponent :data="chartData"/>
      <TotalComponent :value="total" style="flex: 1"/>
    </div>
    <OfflineAlertComponent/>
  </div>
</template>
<style scoped>
#main {
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

@media only screen and (max-width: 600px) {
  #main {
    margin-top: 3rem
  }
}
.error{
  position: absolute;
  top: 0;
  left: 0;
  padding: 1.4rem 0 1.4rem 0;
  width: 100vw;
  z-index: 0;
  color: white;
  font-weight: bold;
}
.bg-danger {
  background-color: red;
}

.bg-default {
  background-color: black;
}
</style>
<script setup>

import BarChartComponent from "@/components/BarChartComponent.vue";
import TotalComponent from "@/components/TotalComponent.vue";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import SettingsComponent from "@/components/SettingsComponent.vue";
import {useStore} from "vuex";
import OfflineAlertComponent from "@/components/OfflineAlertComponent.vue";

const chartData = ref([])
const interval = ref(null);
const error = ref(false);
const total = ref(0);
const store = useStore()
const intervalTime = ref(20000)
const showAlert = ref(false)


watch(() => store.getters.alert, function (v) {
  showAlert.value = v
});


watch(() => store.getters.interval, async function (v) {
  intervalTime.value = v * 1000
  clearInterval(interval.value)
  await fetchData()
  interval.value = setInterval(async () => {
    await fetchData()
  }, intervalTime.value)
});

onMounted(async () => {

      const width = window.innerWidth;
      const height = window.innerHeight;
      alert(`Screen size is: ${width}x${height}`);
  await fetchData()
  interval.value = setInterval(async () => {
    await fetchData()
  }, intervalTime.value)

})
onBeforeUnmount(() => {
  clearInterval(interval.value)
})

const forceFetchData = () => {
  fetchData()
  alert('Richiesta aggiornamento dati inviata')
}


const goFullscreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    console.log('richiesta fullscreen std')
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { // Safari/older Android
    console.log('richiesta fullscreen old')
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    console.log('richiesta fullscreen webkit')
    elem.msRequestFullscreen();
  }else{
    console.error('Error nella richiesta di fullscreen');
  }
}

const fetchData = async () => {

  // URL reale dell'API che vuoi chiamare
  const targetUrl = store.getters.url

  const url = `/.netlify/functions/proxy?url=${encodeURIComponent(targetUrl)}`

  let data = {}

  try {
    const response = await fetch(url, {
      method: 'GET', // o POST, PUT, ecc. a seconda delle tue esigenze
      headers: {
        // Aggiungi eventuali headers necessari
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      error.value = true
      throw new Error('Errore nella richiesta')
    }
    error.value = false

    data = await response.json()

    chartData.value = [
      data.phases[0].powerActive,
      data.phases[1].powerActive,
      data.phases[2].powerActive
    ]

    total.value = parseFloat((data.phases.reduce((sum, phase) => sum + phase.powerActive, 0) / 1000).toFixed(1));

  } catch (error) {
    console.error('Errore:', error)
  }

}
</script>
