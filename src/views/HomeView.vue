<template>
  <v-container fluid>
    <v-row class="mt-2" v-if="payload && tv">
      <v-col cols="12">
        <h1 class="text-h5">Crypto Screener</h1>
        <div>dScreener tries to find the best trading opportunities in crypto market.</div>
      </v-col>
      <v-col cols="12" sm="2" class="d-flex align-center">
        <v-select 
          label="Instruments"
          dense  
          outlined
          hide-details 
          v-model="config.type" 
          :items="type.items" 
          item-text="name" 
          item-value="value" 
          color="c4"
          @change="saveConfig()"
        >
          <template #item="{item}">
            <div class="c1">{{ item.name }}</div>
          </template>
        </v-select>
      </v-col>
      <v-col cols="12" sm="2" class="d-flex align-center">
        <v-select 
          label="Timeframe"
          dense  
          outlined
          hide-details 
          v-model="config.timeframe" 
          :items="timeframe.items" 
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
      <v-col cols="6" sm="2">
        <v-text-field 
          label="RSI Filter Low"
          dense 
          outlined 
          hide-details
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="config.min"
          color="c4"
          @change="saveConfig()"
        />
      </v-col>
      <v-col cols="6" sm="2">
        <v-text-field 
          label="RSI Filter High"
          dense 
          outlined 
          hide-details
          type="number"
          min="0"
          max="100"
          step="1"
          v-model="config.max"
          color="c4"
          @change="saveConfig()"
        />
      </v-col>
      <v-col cols="12" sm="2" class="d-flex align-center">
        <v-select 
          label="Volatility"
          dense  
          outlined
          hide-details 
          v-model="config.volatility" 
          :items="volatility.items" 
          item-text="name" 
          item-value="value" 
          color="c4"
          @change="saveConfig()"
        >
          <template #item="{item}">
            <div class="c1">{{ item.name }}</div>
          </template>
        </v-select>
      </v-col>
      <v-col v-if="payload && tv" cols="12">
        <v-card flat color="c2">
          <v-card-title class="d-flex align-center">
            <span>Watchlist</span>            
            <v-select
              dense 
              flat
              solo 
              chips 
              deletable-chips 
              hide-details 
              small-chips 
              multiple 
              :items="symbols"
              v-model="config.watchlist" 
              @change="saveConfig()" 
              background-color="transparent"
            >
              <template #item="{item}">
                <div class="c1">{{ item }}</div>
              </template>
            </v-select>
            <v-icon color="white" class="off" :class="pulse ? 'pulse' : ''">mdi-pulse</v-icon>
          </v-card-title>
          <v-divider/>
          <v-simple-table v-if="config.watchlist.length" class="transparent" dense>
            <template #default>
              <thead>
                <tr class="font-weight-bold">
                  <th v-for="item, index in headers" :key="'hb'+index">{{ item.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item, triw in watchlistList" :key="triw">
                  <td v-for="header, tdis in headers" :key="tdis">
                    <span v-if="header.value == 'base_currency'" class="font-weight-bold">{{ item.c[header.value] }}</span>
                    <template v-else-if="header.value == '24h_close_change|5'">
                      <span v-if="item.c[header.value]" :class="changeColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="header.value == '24h_vol_to_market_cap'">
                      <span v-if="item.c[header.value]" :class="vol24mcColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="header.value == '24h_vol_change_cmc'">
                      <span v-if="item.c[header.value]" :class="vol24Color(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="/^Volatility(.*)$/.test(header.value)">
                      <span v-if="item.c[header.value]" :class="volatilityColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="/^RSI(.*)$/.test(header.value)">
                      <span v-if="item.c[header.value]" :class="rangeRsiColor(item.c[header.value])">{{(item.c[header.value]).toFixed(2)}}</span>
                      <span v-else>--</span>
                    </template>
                    <span v-else>{{ item.c[header.value] }}</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
      <v-col v-if="payload && tv" cols="12">
        <v-card flat color="c2">
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
                  <th v-for="item, index in headers" :key="'hb'+index" @click="sort.buy = item.value" :class="sort.buy == item.value ? 'high--text' : ''">{{ item.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item, trib in buyList" :key="trib">
                  <td v-for="header, tdib in headers" :key="tdib">
                    <span v-if="header.value == 'base_currency'" class="font-weight-bold">{{ item.c[header.value] }}</span>
                    <template v-else-if="header.value == '24h_close_change|5'">
                      <span v-if="item.c[header.value]" :class="changeColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="header.value == '24h_vol_to_market_cap'">
                      <span v-if="item.c[header.value]" :class="vol24mcColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="header.value == '24h_vol_change_cmc'">
                      <span v-if="item.c[header.value]" :class="vol24Color(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="/^Volatility(.*)$/.test(header.value)">
                      <span v-if="item.c[header.value]" :class="volatilityColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="/^RSI(.*)$/.test(header.value)">
                      <span v-if="item.c[header.value]" :class="buyRsiColor(item.c[header.value])">{{(item.c[header.value]).toFixed(2)}}</span>
                      <span v-else>--</span>
                    </template>
                    <span v-else>{{ item.c[header.value] }}</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div v-else class="text-center pa-4 c4--text">Searching the market ...</div>
        </v-card>
      </v-col>
      <v-col v-if="payload && tv" cols="12">
        <v-card flat color="c2">
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
                  <th v-for="item, index in headers" :key="'hb'+index" @click="sort.sell = item.value" :class="sort.sell == item.value ? 'high--text' : ''">{{ item.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item, tris in sellList" :key="tris">
                  <td v-for="header, tdis in headers" :key="tdis">
                    <span v-if="header.value == 'base_currency'" class="font-weight-bold">{{ item.c[header.value] }}</span>
                    <template v-else-if="header.value == '24h_close_change|5'">
                      <span v-if="item.c[header.value]" :class="changeColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="header.value == '24h_vol_to_market_cap'">
                      <span v-if="item.c[header.value]" :class="vol24mcColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="header.value == '24h_vol_change_cmc'">
                      <span v-if="item.c[header.value]" :class="vol24Color(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="/^Volatility(.*)$/.test(header.value)">
                      <span v-if="item.c[header.value]" :class="volatilityColor(item.c[header.value])">{{item.c[header.value].toFixed(2)}}%</span>
                      <span v-else>--</span>
                    </template>
                    <template v-else-if="/^RSI(.*)$/.test(header.value)">
                      <span v-if="item.c[header.value]" :class="sellRsiColor(item.c[header.value])">{{(item.c[header.value]).toFixed(2)}}</span>
                      <span v-else>--</span>
                    </template>
                    <span v-else>{{ item.c[header.value] }}</span>
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
    config: {
      timeframe: 'RSI|240',
      type: 'spot',
      volatility: 'all',
      watchlist: ['BTC', 'ETH'],
      min: 32,
      max: 68
    },
    headers: [
      {name: 'Symbol', value: 'base_currency'},
      {name: 'Close', value: 'close'},
      {name: 'Change', value: '24h_close_change|5'},
      {name: 'Vol/MC', value: '24h_vol_to_market_cap'},
      {name: 'Vol', value: '24h_vol_change_cmc'},
      {name: 'VLT.D', value: 'Volatility.D'},
      {name: 'VLT.W', value: 'Volatility.W'},
      {name: 'VLT.M', value: 'Volatility.M'},
      {name: '1m', value: 'RSI|1'},
      {name: '5m', value: 'RSI|5'},
      {name: '15m', value: 'RSI|15'},
      {name: '1H', value: 'RSI|60'},
      {name: '4H', value: 'RSI|240'},
      {name: 'Day', value: 'RSI'},
      {name: 'Week', value: 'RSI|1W'},
      {name: 'Month', value: 'RSI|1M'},
    ],
    timeframe: {
      items: [
        {name: '5 Minutes', value: 'RSI|5'},
        {name: '15 Minutes', value: 'RSI|15'},
        {name: '1 Hour', value: 'RSI|60'},
        {name: '4 Hours', value: 'RSI|240'},
        {name: 'Daily', value: 'RSI'},
        {name: 'Weekly', value: 'RSI|1W'},
        {name: 'Monthly', value: 'RSI|1M'}
      ]
    },
    type: {
      items: [
        {name: 'All', value: 'all'},
        {name: 'Spot', value: 'spot'},
        {name: 'Perpetual', value: 'swap'}
      ]
    },
    volatility: {
      items: [
        {name: 'All', value: 'all'},
        {name: 'Volatile', value: 'volatile'}
      ]
    },
    sort: {
      buy: 'RSI|240',
      sell: 'RSI|240'
    }
  }),
  computed: {
    ...mapState(['payload', 'tv', 'cache', 'filters']),
    raw(){
      return this.tv.data.map(item => {
        item.c = {}
        item.d.forEach((value, index) => {
          item.c[this.payload.columns[index]] = value
        })
        return item
      })
    },
    symbols(){
      return this.raw.map(i => { return i.c['base_currency']}).sort((a,b) => { return a > b ? 1 : a < b ? -1 : 0 })
    },
    market(){
      let data = this.raw
      if (this.config.type == 'spot') data = data.filter(i => this.filters.spot.includes(i.c['base_currency']))
      if (this.config.type == 'swap') data = data.filter(i => this.filters.swap.includes(i.c['base_currency']))
      if (this.config.volatility == 'volatile') data = data.filter(i => i.c['Volatility.D'] >= 10 || i.c['Volatility.W'] >= 10 || i.c['Volatility.M'] >= 10)
      return data
    },
    buyList(){
      const list = this.market.filter(i => i.c[this.config.timeframe] <= (this.config.min || 100))
      const asc = ['24h_close_change|5','RSI|1', 'RSI|5', 'RSI|15', 'RSI|30', 'RSI|60', 'RSI|240', 'RSI', 'RSI|1M', 'RSI|1W']
      if (asc.includes(this.sort.buy)) return this.sortASC(list, this.sort.buy)
      else return this.sortDESC(list, this.sort.buy)
    },
    sellList(){
      const list = this.market.filter(i => i.c[this.config.timeframe] >= (this.config.max || 0))
      return this.sortDESC(list, this.sort.sell)
    },
    watchlistList(){
      return this.raw.filter(i => this.config.watchlist.includes(i.c['base_currency']))
    }
  },
  watch: {
    tv(){
      this.pulse = true
      setTimeout(() => this.pulse = false, 2000)
    },
    config(data){
      console.log(data)
    }
  },
  methods: {
    setColumn(v){
      this.sort.buy = v
      this.sort.sell = v
      this.saveConfig()
    },
    sortASC(list, field){
      return list.sort((a,b) => {
        const av = a.c[field]
        const bv = b.c[field]
        return av > bv ? 1 : av < bv ? -1 : 0
      })
    },
    sortDESC(list, field){
      return list.sort((a,b) => {
        const av = a.c[field]
        const bv = b.c[field]
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
      if (value > 30) color = 'low'
      else if (value <= 30 && value >= 25) color = 'medium'
      return `${color}--text`
    },
    sellRsiColor(value){
      let color = 'high'
      if (value < 70) color = 'low'
      else if (value >= 70 && value <= 75) color = 'medium'
      return `${color}--text`
    },
    rangeRsiColor(value){
      let color = 'grey'
      if (value >= 70 && value < 75 || value <= 30 && value > 25) color = 'medium'
      else if (value >= 75) color = 'low'
      else if (value <= 25) color = 'high'
      return `${color}--text`
    },
    saveConfig(){
      localStorage.setItem('dScreener', JSON.stringify(this.config))
    }
  },
  created(){
    const config = localStorage.getItem('dScreener')
    if (config) this.config = JSON.parse(config)
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
