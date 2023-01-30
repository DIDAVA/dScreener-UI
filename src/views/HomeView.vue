<template>
  <v-container fluid>
    <v-row class="mt-2" v-if="payload && tv">
      <v-col cols="12">
        <h1 class="text-h5">Crypto Screener</h1>
        <div>dScreener tries to find the best trading opportunities in crypto market.</div>
      </v-col>
      <v-col cols="12" sm="3" class="d-flex align-center">
        <v-select 
          label="Timeframe"
          dense  
          outlined
          hide-details 
          v-model="separator.value" 
          :items="separator.items" 
          item-text="name" 
          item-value="value" 
          color="c4"
          @change="setColumn"
        >
          <template #item="{item}">
            <div class="c1">{{ item.name }}</div>
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" sm="3" class="d-flex align-center">
        <v-select 
          label="Instruments"
          dense  
          outlined
          hide-details 
          v-model="type.value" 
          :items="type.items" 
          item-text="name" 
          item-value="value" 
          color="c4"
        >
          <template #item="{item}">
            <div class="c1">{{ item.name }}</div>
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" sm="3" class="d-flex align-center">
        <v-select 
          label="Volatility"
          dense  
          outlined
          hide-details 
          v-model="volatility.value" 
          :items="volatility.items" 
          item-text="name" 
          item-value="value" 
          color="c4"
        >
          <template #item="{item}">
            <div class="c1">{{ item.name }}</div>
          </template>
        </v-select>
      </v-col>
      <v-col cols="12">
        <v-card v-if="payload && tv" flat color="c2">
          <v-card-title>
            <span>{{buyList.length}} Buy Oportuninties</span>
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
                  <th @click="sort.buy = 7" :class="sort.buy == 7 ? 'high--text' : ''">Change</th>
                  <th @click="sort.buy = 9" :class="sort.buy == 9 ? 'high--text' : ''">Vol/MC</th>
                  <th @click="sort.buy = 10" :class="sort.buy == 10 ? 'high--text' : ''">Vol</th>
                  <th @click="sort.buy = 11" :class="sort.buy == 11 ? 'high--text' : ''">VLT.D</th>
                  <th @click="sort.buy = 12" :class="sort.buy == 12 ? 'high--text' : ''">VLT.W</th>
                  <th @click="sort.buy = 13" :class="sort.buy == 13 ? 'high--text' : ''">VLT.M</th>
                  <th @click="sort.buy = 15" :class="sort.buy == 15 ? 'high--text' : ''">5m</th>
                  <th @click="sort.buy = 16" :class="sort.buy == 16 ? 'high--text' : ''">15m</th>
                  <th @click="sort.buy = 17" :class="sort.buy == 17 ? 'high--text' : ''">30m</th>
                  <th @click="sort.buy = 18" :class="sort.buy == 18 ? 'high--text' : ''">1H</th>
                  <th @click="sort.buy = 19" :class="sort.buy == 19 ? 'high--text' : ''">4H</th>
                  <th @click="sort.buy = 20" :class="sort.buy == 20 ? 'high--text' : ''">Day</th>
                  <th @click="sort.buy = 21" :class="sort.buy == 21 ? 'high--text' : ''">Week</th>
                  <th @click="sort.buy = 22" :class="sort.buy == 22 ? 'high--text' : ''">Month</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item, index in buyList" :key="index">
                  <td class="font-weight-bold">{{ item.d[0] }}</td>
                  <td>{{ item.d[3] }}</td>
                  <td v-if="item.d[7]" :class="changeColor(item.d[7])">{{ item.d[7].toFixed(2) }}%</td>
                  <td v-else>--</td>
                  <td v-if="item.d[9]" :class="vol24mcColor(item.d[9])">{{ item.d[9].toFixed(2) }}</td>
                  <td v-else>--</td>
                  <td v-if="item.d[10]" :class="vol24Color(item.d[10])">{{ item.d[10].toFixed(2) }}%</td>
                  <td v-else>--</td>
                  <td v-for="value, index in item.d.slice(11, 14)" :key="'vltb' + index">
                    <span v-if="value" :class="volatilityColor(value)">{{ value.toFixed(2) }}%</span>
                    <span v-else>--</span>
                  </td>
                  <td v-for="value, index in item.d.slice(15, 23)" :key="'rsib' + index">
                    <span v-if="value" :class="buyRsiColor(value)">{{ value.toFixed(2) }}</span>
                    <span v-else>--</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-else class="text-center pa-4 c4--text">Searching the market ...</div>
        </v-card>
      </v-col>
      <v-col>
        <v-card v-if="payload && tv" flat color="c2">
          <v-card-title>
            <span>{{sellList.length}} Sell Oportuninties</span>
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
                  <th @click="sort.sell = 7" :class="sort.sell == 7 ? 'high--text' : ''">Change</th>
                  <th @click="sort.sell = 9" :class="sort.sell == 9 ? 'high--text' : ''">Vol/MC</th>
                  <th @click="sort.sell = 10" :class="sort.sell == 10 ? 'high--text' : ''">Vol</th>
                  <th @click="sort.sell = 11" :class="sort.sell == 11 ? 'high--text' : ''">VLT.D</th>
                  <th @click="sort.sell = 12" :class="sort.sell == 12 ? 'high--text' : ''">VLT.W</th>
                  <th @click="sort.sell = 13" :class="sort.sell == 13 ? 'high--text' : ''">VLT.M</th>
                  <th @click="sort.sell = 15" :class="sort.sell == 15 ? 'high--text' : ''">5m</th>
                  <th @click="sort.sell = 16" :class="sort.sell == 16 ? 'high--text' : ''">15m</th>
                  <th @click="sort.sell = 17" :class="sort.sell == 17 ? 'high--text' : ''">30m</th>
                  <th @click="sort.sell = 18" :class="sort.sell == 18 ? 'high--text' : ''">1H</th>
                  <th @click="sort.sell = 19" :class="sort.sell == 19 ? 'high--text' : ''">4H</th>
                  <th @click="sort.sell = 20" :class="sort.sell == 20 ? 'high--text' : ''">Day</th>
                  <th @click="sort.sell = 21" :class="sort.sell == 21 ? 'high--text' : ''">Week</th>
                  <th @click="sort.sell = 22" :class="sort.sell == 22 ? 'high--text' : ''">Month</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item, index in sellList" :key="index">
                  <td class="font-weight-bold">{{ item.d[0] }}</td>
                  <td>{{ item.d[3] }}</td>
                  <td v-if="item.d[7]" :class="changeColor(item.d[7])">{{ item.d[7].toFixed(2) }}%</td>
                  <td v-else>--</td>
                  <td v-if="item.d[9]" :class="vol24mcColor(item.d[9])">{{ item.d[9].toFixed(2) }}</td>
                  <td v-else>--</td>
                  <td v-if="item.d[10]" :class="vol24Color(item.d[10])">{{ item.d[10].toFixed(2) }}%</td>
                  <td v-else>--</td>
                  <td v-for="value, index in item.d.slice(11, 14)" :key="'vlts' + index">
                    <span v-if="value" :class="volatilityColor(value)">{{ value.toFixed(2) }}%</span>
                    <span v-else>--</span>
                  </td>
                  <td v-for="value, index in item.d.slice(15, 23)" :key="'rsis' + index">
                    <span v-if="value" :class="sellRsiColor(value)">{{ value.toFixed(2) }}</span>
                    <span v-else>--</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-else class="text-center pa-4 c4--text">Searching the market ...</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'HomeView',
  components: {},
  data: () => ({
    pulse: false,
    volatile: false,
    separator: {
      value: 20,
      items: [
        {name: '5 Minutes', value: 15},
        {name: '15 Minutes', value: 16},
        {name: '30 Minutes', value: 17},
        {name: '1 Hour', value: 18},
        {name: '4 Hours', value: 19},
        {name: 'Daily', value: 20},
        {name: 'Weekly', value: 21},
        {name: 'Monthly', value: 22}
      ]
    },
    type: {
      value: 'spot',
      items: [
        {name: 'All', value: 'all'},
        {name: 'Spot', value: 'spot'},
        {name: 'Perpetual', value: 'swap'}
      ]
    },
    volatility: {
      value: 'all',
      items: [
        {name: 'All', value: 'all'},
        {name: 'Volatile', value: 'volatile'}
      ]
    },
    sort: {
      buy: 17,
      sell: 17
    }
  }),
  computed: {
    ...mapState(['payload', 'tv', 'cache', 'filters']),
    market(){
      let data = [...this.tv.data]
      //if (this.volatile) data = data.filter(i => i.d[11] >= 10 || i.d[12] >= 10 || i.d[13] >= 10)
      if (this.type.value == 'spot') data = data.filter(i => this.filters.spot.includes(i.d[0]))
      if (this.type.value == 'swap') data = data.filter(i => this.filters.swap.includes(i.d[0]))
      if (this.volatility.value == 'volatile') data = data.filter(i => i.d[11] >= 10 || i.d[12] >= 10 || i.d[13] >= 10)
      return data
    },
    buyList(){
      const list = this.market.filter(i => i.d[this.separator.value] <= 31)
      if ([6,7].includes(this.sort.buy) || this.sort.buy >= 14) return this.sortASC(list, this.sort.buy)
      else return this.sortDESC(list, this.sort.buy)
    },
    sellList(){
      const list = this.market.filter(i => i.d[this.separator.value] > 69)
      return this.sortDESC(list, this.sort.sell)
    }
  },
  watch: {
    tv(){
      this.pulse = true
      setTimeout(() => this.pulse = false, 2000)
    }
  },
  methods: {
    setColumn(v){
      this.sort.buy = v
      this.sort.sell = v
    },
    sortASC(list, field){
      return list.sort((a,b) => {
        const av = a.d[field]
        const bv = b.d[field]
        return av > bv ? 1 : av < bv ? -1 : 0
      })
    },
    sortDESC(list, field){
      return list.sort((a,b) => {
        const av = a.d[field]
        const bv = b.d[field]
        return av > bv ? -1 : av < bv ? 1 : 0
      })
    },
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
      if (value < 5) color = 'low'
      else if (value >= 5 && value <= 10) color = 'medium'
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
