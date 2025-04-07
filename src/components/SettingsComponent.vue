<template>
  <div>
    <button
        style="position:absolute; z-index: 10; right:1rem; top:1rem; background-color: transparent; border: none; color: white"
        @click="openModal">
      <i class="fa-solid fa-3x fa-gears"></i>
    </button>


    <div class="modal-overlay" v-if="showSettings">
      <div class="modal-container">
        <form @submit.prevent="saveSettings">
          <div class="form-group">
            <label for="url">URL:</label>
            <input
                type="text"
                id="url"
                v-model="formData.url"
                placeholder="Inserisci indirizzo"
            >
          </div>

            <div class="form-group">
              <label for="interval">Intervallo richieste (secondi):</label>
              <input
                  type="number"
                  id="interval"
                  v-model.number="formData.interval"
                  min="1"
                  placeholder="Inserisci intervallo"
              >
            </div>

            <div class="form-group">
              <label for="limit">Soglia limite (kW):</label>
              <input
                  type="number"
                  id="limit"
                  v-model.number="formData.limit"
                  min="1"
                  placeholder="Inserisci soglia limite"
              >
            </div>


          <div class="form-group" style="flex: 1">
            <label for="limit">Suono attivo:</label>
            <label class="switch">
              <input type="checkbox" v-model="formData.soundStatus">
              <span class="slider"></span>
            </label>
          </div>

          <div class="button-group">
            <button type="submit" class="save-btn" style="flex: 1">Salva</button>
            <button type="button" class="cancel-btn" style="flex:1" @click="closeModal">Annulla</button>
          </div>
        </form>
      </div>
    </div>


  </div>
</template>
<style scoped>
input[type="text"], input[type="number"]{
  padding: 1rem;
  font-size: 1rem;
}
h1 {
  font-size: 11rem;
}
/* Contenitore switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px;
}

/* Nasconde l'input checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* Slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 25px;
}

/* Pallina dentro lo slider */
.slider::before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 3.5px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

/* Cambia colore quando è attivo */
input:checked + .slider {
  background-color: #4caf50;
}

/* Muove la pallina quando è attivo */
input:checked + .slider::before {
  transform: translateX(24px);
}
</style>
<script setup>
import {ref} from "vue";
import {useStore} from "vuex";

const showSettings = ref(false)

const store = useStore()

const formData = ref({
  url: '',
  interval: null,
  limit: null,
  soundStatus: false
})

const openModal = async() => {
  formData.value.url = store.getters.url
  formData.value.interval = store.getters.interval
  formData.value.limit = store.getters.limit
  formData.value.soundStatus = store.getters.soundStatus
  showSettings.value = true
}

const closeModal = async () => {
  showSettings.value = false
}

const saveSettings = async () => {
  // Validate input
  if (!formData.value.url || !formData.value.interval || !formData.value.limit) {
    alert('Compilare tutti i campi!');
    return;
  }

  store.commit('setLimit', formData.value.limit)
  store.commit('setUrl', formData.value.url)
  store.commit('setInterval', formData.value.interval)
  store.commit('setSoundStatus', formData.value.soundStatus)
  closeModal()
}

</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: rgba(220, 220, 220, 1);
  padding: 10px 20px 10px 20px;
  border-radius: 2px;
  width: 100%;
  color: black !important;
  max-width: 500px;
  text-align: left;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 2px;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  justify-content: end;
  gap: 1rem;
  margin-top: 20px;
}

.save-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}
</style>