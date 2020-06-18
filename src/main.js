import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLodash from 'vue-lodash'
import '@/assets/fonts/stylesheet.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Dropdown from 'bp-vuejs-dropdown';
import lodash from 'lodash';
import vuetify from '@/plugins/vuetify'
import ClickOutside from "vuetify/lib/directives/click-outside";
import VueInputAutowidth from 'vue-input-autowidth';

Vue.use(Dropdown);
Vue.use(VueInputAutowidth);
Vue.use(VueLodash, {lodash: lodash});
Vue.directive('v-click-outside', ClickOutside);
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')