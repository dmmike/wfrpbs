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
//TODO: Implement clickoutside instead of custom solution
import ClickOutside from "vuetify/lib/directives/click-outside";

import {Character, Combatant, NPC} from "@/classes/Combatant";

import {store} from "@/store";

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {
    faBalanceScale,
    faBed,
    faBolt,
    faBroom,
    faCheck,
    faChevronCircleDown,
    faChevronCircleUp,
    faCopy,
    faFeatherAlt,
    faHeart,
    faMinus,
    faPlus,
    faUserSlash
} from '@fortawesome/free-solid-svg-icons'

library.add(
    faFeatherAlt,
    faUserSlash,
    faCopy,
    faHeart,
    faBalanceScale,
    faBolt,
    faBed,
    faCheck,
    faPlus,
    faMinus,
    faChevronCircleUp,
    faChevronCircleDown,
    faBroom
);

Vue.prototype.$Combatant = Combatant;
Vue.prototype.$Character = Character;
Vue.prototype.$NPC = NPC;

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(Dropdown);
Vue.use(VueLodash, {lodash: lodash});
Vue.directive('click-outside', ClickOutside);
Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: function (h) {
        return h(App)
    },
    beforeCreate() {
        store.dispatch('loadData');
    },
}).$mount('#app')