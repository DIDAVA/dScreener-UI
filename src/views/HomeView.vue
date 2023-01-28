<template>
  <v-container>
    <h1 class="text-h5 d-flex">
      <span>Crypto Screener</span>
      <v-spacer/>
    </h1>
    <div>dScreener tries to find the best trading opportunities in crypto market.</div>
    <v-card v-if="payload && tv" flat color="blue-grey darken-4" class="mt-4">
      <v-card-title>
        <span>Buy Oportuninties</span>
        <v-spacer/>
        <v-icon color="high" class="off" :class="pulse ? 'pulse' : ''">mdi-pulse</v-icon>
      </v-card-title>
      <v-divider/>
      <v-simple-table v-if="buyList.length" class="transparent" dense>
        <template #default>
          <thead>
            <tr class="font-weight-bold">
              <th>Symbol</th>
              <th>Close</th>
              <th>Change</th>
              <th>Change 24H</th>
              <th>Vol24H/MCap</th>
              <th>Vol24H Change</th>
              <th>Volatility</th>
              <th>RSI 15m</th>
              <th>RSI 30m</th>
              <th>RSI 1H</th>
              <th>RSI 4H</th>
              <th>RSI 1D</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item, index in buyList" :key="index">
              <td class="font-weight-bold">{{ item.d[0] }}</td>
              <td>{{ item.d[3] }}</td>
              <td :class="changeColor(item.d[6])">{{ item.d[6].toFixed(2) }}%</td>
              <td :class="changeColor(item.d[7])">{{ item.d[7].toFixed(2) }}%</td>
              <td :class="vol24mcColor(item.d[9])">{{ item.d[9].toFixed(2) }}</td>
              <td :class="vol24Color(item.d[10])">{{ item.d[10].toFixed(2) }}%</td>
              <td :class="volatilityColor(item.d[11])">{{ item.d[11].toFixed(2) }}%</td>
              <td :class="buyRsiColor(item.d[12])">{{ item.d[12].toFixed(2) }}</td>
              <td :class="buyRsiColor(item.d[13])">{{ item.d[13].toFixed(2) }}</td>
              <td :class="buyRsiColor(item.d[14])">{{ item.d[14].toFixed(2) }}</td>
              <td :class="buyRsiColor(item.d[15])">{{ item.d[15].toFixed(2) }}</td>
              <td :class="buyRsiColor(item.d[16])">{{ item.d[16].toFixed(2) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div v-else class="text-center pa-4">Searching the market ...</div>
    </v-card>
    <v-card v-if="payload && tv" flat color="blue-grey darken-4" class="mt-4">
      <v-card-title>
        <span>Sell Oportuninties</span>
        <v-spacer/>
        <v-icon color="low" class="off" :class="pulse ? 'pulse' : ''">mdi-pulse</v-icon>
      </v-card-title>
      <v-divider/>
      <v-simple-table v-if="sellList.length" class="transparent" dense>
        <template #default>
          <thead>
            <tr class="font-weight-bold">
              <th>Symbol</th>
              <th>Close</th>
              <th>Change</th>
              <th>Change 24H</th>
              <th>Vol24H/MCap</th>
              <th>Vol24H Change</th>
              <th>Volatility</th>
              <th>RSI 15m</th>
              <th>RSI 30m</th>
              <th>RSI 1H</th>
              <th>RSI 4H</th>
              <th>RSI 1D</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item, index in sellList" :key="index">
              <td class="font-weight-bold">{{ item.d[0] }}</td>
              <td>{{ item.d[3] }}</td>
              <td :class="changeColor(item.d[6])">{{ item.d[6].toFixed(2) }}%</td>
              <td :class="changeColor(item.d[7])">{{ item.d[7].toFixed(2) }}%</td>
              <td :class="vol24mcColor(item.d[9])">{{ item.d[9].toFixed(2) }}</td>
              <td :class="vol24Color(item.d[10])">{{ item.d[10].toFixed(2) }}%</td>
              <td :class="volatilityColor(item.d[11])">{{ item.d[11].toFixed(2) }}%</td>
              <td :class="sellRsiColor(item.d[12])">{{ item.d[12].toFixed(2) }}</td>
              <td :class="sellRsiColor(item.d[13])">{{ item.d[13].toFixed(2) }}</td>
              <td :class="sellRsiColor(item.d[14])">{{ item.d[14].toFixed(2) }}</td>
              <td :class="sellRsiColor(item.d[15])">{{ item.d[15].toFixed(2) }}</td>
              <td :class="sellRsiColor(item.d[16])">{{ item.d[16].toFixed(2) }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div v-else class="text-center pa-4">Searching the market ...</div>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'HomeView',
  components: {},
  data: () => ({
    pulse: false
  }),
  computed: {
    ...mapState(['payload', 'tv', 'cache']),
    buyList(){
      return this.tv.data.filter(i => i.d[14] < 50).sort((a,b) => {
        const av = a.d[14]
        const bv = b.d[14]
        return av > bv ? 1 : av < bv ? -1 : 0
      })
    },
    sellList(){
      return this.tv.data.filter(i => i.d[14] > 50).sort((a, b) => {
        const av = a.d[14]
        const bv = b.d[14]
        return av > bv ? -1 : av < bv ? 1 : 0
      })
    }
  },
  watch: {
    tv(){
      this.pulse = true
      setTimeout(() => this.pulse = false, 2000)
    }
  },
  methods: {
    changeColor(value){
      let color = 'medium'
      if (value > 0) color = 'high'
      else if (value < 0) color = 'low'
      return `${color}--text`
    },
    vol24mcColor(value){
      let color = 'high'
      if (value < 0.5) color = 'low'
      else if (value >= 0.5 && value <= 1) color = 'medium'
      return `${color}--text`
    },
    vol24Color(value){
      let color = 'high'
      if (value < 25) color = 'low'
      else if (value >= 25 && value <= 50) color = 'medium'
      return `${color}--text`
    },
    volatilityColor(value){
      let color = 'high'
      if (value < 30) color = 'low'
      else if (value >= 30 && value <= 50) color = 'medium'
      return `${color}--text`
    },
    buyRsiColor(value){
      let color = 'high'
      if (value > 25) color = 'low'
      else if (value <= 25 && value >= 20) color = 'medium'
      return `${color}--text`
    },
    sellRsiColor(value){
      let color = 'high'
      if (value < 75) color = 'low'
      else if (value >= 75 && value <= 80) color = 'medium'
      return `${color}--text`
    }
  }
}
</script>

<style scoped>
@keyframes pulse {
  0% { opacity: 1; }
  100% { opacity: 0.1; }
}
.off { opacity: 0.1; }
.pulse {
  animation-name: pulse;
  animation-duration: 1.5s;
}
</style>
