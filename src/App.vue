<template>
  <v-app>
    <v-app-bar app color="blue-grey darken-4" elevation="0" dense dark>
      <v-btn icon><v-icon>mdi-menu</v-icon></v-btn>
      <v-img src="@/assets/logo.png" max-width="90" max-height="80" />
    </v-app-bar>
    <v-main app class="grey darken-4">
      <router-view/>
    </v-main>

    <v-footer>
      <v-icon :color="socket.connected ? 'high' : 'low'">mdi-access-point</v-icon>
      <v-spacer />
      <span class="caption">v0.1 Beta</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',

  data: () => ({
    //
  }),
  computed: {
    ...mapState(['socket'])
  },
  created(){
    this.$store.dispatch('init')
  }
};
</script>
