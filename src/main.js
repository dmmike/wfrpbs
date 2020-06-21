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

import {Character, Combatant, NPC} from "@/classes/Combatant";

import {store} from "@/store";

import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {
    faBalanceScale,
    faBed,
    faBolt,
    faCopy,
    faFeatherAlt,
    faHeart,
    faUserSlash
} from '@fortawesome/free-solid-svg-icons'

library.add(faFeatherAlt, faUserSlash, faCopy, faHeart, faBalanceScale, faBolt, faBed);


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
    store,
    vuetify,
    render: function (h) {
        return h(App)
    },
    beforeCreate() {
        let libraryOpen = localStorage.getItem('library-open');
        // if (libraryOpen) this.setLibraryOpen(libraryOpen === 'true');
        if (libraryOpen) store.commit('setLibraryOpen', libraryOpen === 'true');

        let data = JSON.parse(localStorage.getItem('library'));
        if (data) {
            store.commit('importLibrary', Object.values(data.bestiary).concat(Object.values(data.characters)));
       }
    },
}).$mount('#app')