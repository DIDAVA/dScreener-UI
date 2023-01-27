import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  theme: { 
    dark: true,
    themes: {
      dark: {
        c1: '#0D1B2A',
        c2: '#1B263B',
        c3: '#415A77',
        c4: '#778DA9',
        c5: '#E0E1DD',
        low: '#FF5E5B',
        medium: '#FFB563',
        high: '#70F8BA'
      }
    }
  },
});
