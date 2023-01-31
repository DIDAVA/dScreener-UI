import Vue from 'vue'
import Vuex from 'vuex'
const io = require('socket.io-client')
const local = false
const socket = io(local ? 'http://localhost:8000' : 'https://screener.didava.ir')
socket.on('connect', () => console.log('Socket Connected'))
const filters = require('@/data/filters')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket,
    payload: null,
    filters,
    tv: null,
    cache: null
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    init({state}){
      socket.on('welcome', () => console.log('WELCOME'))
      socket.on('payload', payload => {
        //console.log(payload)
        state.payload = payload
      })
      socket.on('data', data => {
        //console.log(data)
        state.cache = state.tv
        state.tv = data
      })
      socket.connect()
    }
  },
  modules: {
  }
})
