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
import { library } from '@fortawesome/fontawesome-svg-core'
import {faUserSlash, faFeatherAlt, faCopy} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {Combatant, Character, NPC} from "@/classes/Combatant";

library.add(faFeatherAlt, faUserSlash, faCopy);

Vue.prototype.$Combatant = Combatant;
Vue.prototype.$Character = Character;
Vue.prototype.$NPC = NPC;

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(Dropdown);
Vue.use(VueLodash, {lodash: lodash});
Vue.directive('v-click-outside', ClickOutside);
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')