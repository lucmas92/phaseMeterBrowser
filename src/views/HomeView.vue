<template>
  <div class="home" :class="{'bg-danger': showAlert, 'bg-default': !showAlert}">
    <div class="banner error bg-danger" v-if="error">
      Errore nella richiesta!
    </div>
    <div class="banner bg-info" v-if="info">
      {{ info }}
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

.bg-info{
  z-index: 99 !important;
  background-color: rgba(0, 0, 0, 0.9);
}

.banner {
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
const info = ref('');
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
  showInfo('Richiesta aggiornamento dati inviata')
}

const showInfo = (text) => {
  info.value = text
  setTimeout(() => {
    info.value = ''
  }, 3000)
}

const goFullscreen = () => {
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    alert('richiesta fullscreen std')
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { // Safari/older Android
    alert('richiesta fullscreen old')
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    alert('richiesta fullscreen webkit')
    elem.msRequestFullscreen();
  } else {
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

    // if (!response.ok) {
    //   error.value = true
    //   throw new Error('Errore nella richiesta')
    // }
    error.value = false

    // data = await response.json()
    data = {
      "connected": true,
      "connectedCode": "CONNECTED",
      "support": 65535,
      "currency": "EUR",
      "pricePerUnit": 0.25,
      "totalCost": 25200.43,
      "phases": [{
        "number": 1,
        "frequency": 49.95,
        "voltage": 218.59,
        "current": 2.877,
        "powerActive": 598.66272,
        "powerReactive": 44.20336,
        "powerApparent": 616.7572,
        "powerFactor": 0.968,
        "phaseAngle": 4.5,
        "totalForwardActiveEnergy": 29234.01958,
        "totalReverseActiveEnergy": 0.06848,
        "totalForwardReactiveEnergy": 7249.51144,
        "totalReverseReactiveEnergy": 19.56792
      }, {
        "number": 2,
        "frequency": 49.95,
        "voltage": 226.59,
        "current": 12.623,
        "powerActive": 2803.39416,
        "powerReactive": -65.13248,
        "powerApparent": 2804.33542,
        "powerFactor": 0.998,
        "phaseAngle": -1.5,
        "totalForwardActiveEnergy": 29273.50348,
        "totalReverseActiveEnergy": 0.09814,
        "totalForwardReactiveEnergy": 533.4208,
        "totalReverseReactiveEnergy": 1324.1807
      }, {
        "number": 3,
        "frequency": 49.95,
        "voltage": 224.02,
        "current": 7.12,
        "powerActive": 1481.37692,
        "powerReactive": 397.27526,
        "powerApparent": 1563.77158,
        "powerFactor": 0.947,
        "phaseAngle": 15.2,
        "totalForwardActiveEnergy": 42294.21286,
        "totalReverseActiveEnergy": 0.07246,
        "totalForwardReactiveEnergy": 8771.6477,
        "totalReverseReactiveEnergy": 32.92762
      }]
    }

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
