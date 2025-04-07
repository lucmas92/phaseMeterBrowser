import {createStore} from 'vuex'

export default createStore({
    state: {
        url: 'https://svr78.supla.org/direct/927/jW53MRbcodQwZj/read?format=json',
        limit: 10,
        interval: 10,
        alert: false,
        soundStatus: false
    },
    getters: {
        url(state) {
            return state.url
        },
        limit(state) {
            return state.limit
        },
        interval(state) {
            return state.interval
        },
        alert(state) {
            return state.alert
        },
        soundStatus(state) {
            return state.soundStatus
        },
    },
    mutations: {
        setLimit(state, limit) {
            state.limit = limit
        },
        setInterval(state, interval) {
            state.interval = interval
        },
        setUrl(state, url) {
            state.url = url
        },
        setAlert(state, alert) {
            state.alert = alert
        },
        setSoundStatus(state, status) {
            state.soundStatus = status
        }
    },
    actions: {},
    modules: {}
})
