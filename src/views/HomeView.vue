<template>
  <v-container>
    <h1 class="text-h5 d-flex">
      <span>Crypto Screener</span>
      <v-spacer/>
    </h1>
    <div>dScreener tries to find the best trading opportunities in crypto market.</div>
    <v-card v-if="payload && tv" flat color="c2" class="mt-4">
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
              <th @click="sort.buy = 6" :class="sort.buy == 6 ? 'high--text' : ''">Change</th>
              <th @click="sort.buy = 7" :class="sort.buy == 7 ? 'high--text' : ''">Change 24H</th>
              <th @click="sort.buy = 9" :class="sort.buy == 9 ? 'high--text' : ''">Vol24H/MCap</th>
              <th @click="sort.buy = 10" :class="sort.buy == 10 ? 'high--text' : ''">Vol24H Change</th>
              <th @click="sort.buy = 11" :class="sort.buy == 11 ? 'high--text' : ''">Volatility</th>
              <th @click="sort.buy = 12" :class="sort.buy == 12 ? 'high--text' : ''">RSI 15m</th>
              <th @click="sort.buy = 13" :class="sort.buy == 13 ? 'high--text' : ''">RSI 30m</th>
              <th @click="sort.buy = 14" :class="sort.buy == 14 ? 'high--text' : ''">RSI 1H</th>
              <th @click="sort.buy = 15" :class="sort.buy == 15 ? 'high--text' : ''">RSI 4H</th>
              <th @click="sort.buy = 16" :class="sort.buy == 16 ? 'high--text' : ''">RSI D</th>
              <th @click="sort.buy = 17" :class="sort.buy == 17 ? 'high--text' : ''">RSI W</th>
              <th @click="sort.buy = 18" :class="sort.buy == 18 ? 'high--text' : ''">RSI M</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item, index in buyList" :key="index">
              <td class="font-weight-bold">{{ item.d[0] }}</td>
              <td>{{ item.d[3] }}</td>
              <td v-if="item.d[6]" :class="changeColor(item.d[6])">{{ item.d[6].toFixed(2) }}%</td>
              <td v-else>--</td>
              <td v-if="item.d[7]" :class="changeColor(item.d[7])">{{ item.d[7].toFixed(2) }}%</td>
              <td v-else>--</td>
              <td v-if="item.d[9]" :class="vol24mcColor(item.d[9])">{{ item.d[9].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[10]" :class="vol24Color(item.d[10])">{{ item.d[10].toFixed(2) }}%</td>
              <td v-else>--</td>
              <td v-if="item.d[11]" :class="volatilityColor(item.d[11])">{{ item.d[11].toFixed(2) }}%</td>
              <td v-else>--</td>
              <td v-if="item.d[12]" :class="buyRsiColor(item.d[12])">{{ item.d[12].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[13]" :class="buyRsiColor(item.d[13])">{{ item.d[13].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[14]" :class="buyRsiColor(item.d[14])">{{ item.d[14].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[15]" :class="buyRsiColor(item.d[15])">{{ item.d[15].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[16]" :class="buyRsiColor(item.d[16])">{{ item.d[16].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[17]" :class="buyRsiColor(item.d[17])">{{ item.d[17].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[18]" :class="buyRsiColor(item.d[18])">{{ item.d[18].toFixed(2) }}</td>
              <td v-else>--</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div v-else class="text-center pa-4 c4--text">Searching the market ...</div>
    </v-card>
    <v-card v-if="payload && tv" flat color="c2" class="mt-4">
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
              <th @click="sort.sell = 6" :class="sort.sell == 6 ? 'high--text' : ''">Change</th>
              <th @click="sort.sell = 7" :class="sort.sell == 7 ? 'high--text' : ''">Change 24H</th>
              <th @click="sort.sell = 9" :class="sort.sell == 9 ? 'high--text' : ''">Vol24H/MCap</th>
              <th @click="sort.sell = 10" :class="sort.sell == 10 ? 'high--text' : ''">Vol24H Change</th>
              <th @click="sort.sell = 11" :class="sort.sell == 11 ? 'high--text' : ''">Volatility</th>
              <th @click="sort.sell = 12" :class="sort.sell == 12 ? 'high--text' : ''">RSI 15m</th>
              <th @click="sort.sell = 13" :class="sort.sell == 13 ? 'high--text' : ''">RSI 30m</th>
              <th @click="sort.sell = 14" :class="sort.sell == 14 ? 'high--text' : ''">RSI 1H</th>
              <th @click="sort.sell = 15" :class="sort.sell == 15 ? 'high--text' : ''">RSI 4H</th>
              <th @click="sort.sell = 16" :class="sort.sell == 16 ? 'high--text' : ''">RSI D</th>
              <th @click="sort.sell = 17" :class="sort.sell == 17 ? 'high--text' : ''">RSI W</th>
              <th @click="sort.sell = 18" :class="sort.sell == 18 ? 'high--text' : ''">RSI M</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item, index in sellList" :key="index">
              <td class="font-weight-bold">{{ item.d[0] }}</td>
              <td>{{ item.d[3] }}</td>
              <td v-if="item.d[6]" :class="changeColor(item.d[6])">{{ item.d[6].toFixed(2) }}%</td>
              <td v-else>--</td>
              <td v-if="item.d[7]" :class="changeColor(item.d[7])">{{ item.d[7].toFixed(2) }}%</td>
              <td v-else>--</td>
              <td v-if="item.d[9]" :class="vol24mcColor(item.d[9])">{{ item.d[9].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[10]" :class="vol24Color(item.d[10])">{{ item.d[10].toFixed(2) }}%</td>
              <td v-else>--</td>
              <td v-if="item.d[11]" :class="volatilityColor(item.d[11])">{{ item.d[11].toFixed(2) }}%</td>
              <td v-else>--</td>
              <td v-if="item.d[12]" :class="sellRsiColor(item.d[12])">{{ item.d[12].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[13]" :class="sellRsiColor(item.d[13])">{{ item.d[13].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[14]" :class="sellRsiColor(item.d[14])">{{ item.d[14].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[15]" :class="sellRsiColor(item.d[15])">{{ item.d[15].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[16]" :class="sellRsiColor(item.d[16])">{{ item.d[16].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[17]" :class="sellRsiColor(item.d[17])">{{ item.d[17].toFixed(2) }}</td>
              <td v-else>--</td>
              <td v-if="item.d[18]" :class="sellRsiColor(item.d[18])">{{ item.d[18].toFixed(2) }}</td>
              <td v-else>--</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div v-else class="text-center pa-4 c4--text">Searching the market ...</div>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'HomeView',
  components: {},
  data: () => ({
    pulse: false,
    sort: {
      buy: 15,
      sell: 15
    }
  }),
  computed: {
    ...mapState(['payload', 'tv', 'cache']),
    buyList(){
      return this.tv.data.filter(i => i.d[15] < 50).sort((a,b) => {
        const av = a.d[this.sort.buy]
        const bv = b.d[this.sort.buy]
        return av > bv ? 1 : av < bv ? -1 : 0
      })
    },
    sellList(){
      return this.tv.data.filter(i => i.d[15] > 50).sort((a, b) => {
        const av = a.d[this.sort.sell]
        const bv = b.d[this.sort.sell]
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
