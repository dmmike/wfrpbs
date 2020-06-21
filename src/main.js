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
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {Character, Combatant, NPC} from "@/classes/Combatant";
import Vuex from 'vuex';
import {
    faBalanceScale,
    faBed,
    faBolt,
    faCopy,
    faFeatherAlt,
    faHeart,
    faUserSlash
} from '@fortawesome/free-solid-svg-icons'
import TraitsAndTalents from "@/classes/TraitsAndTalents";

library.add(faFeatherAlt, faUserSlash, faCopy, faHeart, faBalanceScale, faBolt, faBed);

Vue.use(Vuex);

Vue.prototype.$Combatant = Combatant;
Vue.prototype.$Character = Character;
Vue.prototype.$NPC = NPC;

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(Dropdown);
Vue.use(VueLodash, {lodash: lodash});
Vue.directive('v-click-outside', ClickOutside);
Vue.config.productionTip = false

const store = new Vuex.Store({
    state: {
        // Data
        library: {
            bestiary: {},
            characters: {},
            encounters: {},
        },
        allTraits: TraitsAndTalents.TRAITS,

        // Selections
        activeCombatant: null,
        selectedCombatant: null,

        // View state
        combatStarted: false,
        libraryOpen: false,

        // Settings
        initiativeType: 'default',
        useMaxAdvantage: false,
    },
    mutations: {
        openLibrary(state) {
            state.libraryOpen = true;
        },
        closeLibrary(state) {
            state.libraryOpen = false;
        },
        setLibraryOpen(state, value) {
            state.libraryOpen = value;
        },
        selectCombatant(state, value) {
            state.selectedCombatant = value;
        },
        deselectCombatant(state) {
            state.selectedCombatant = null;
        },
        setNPC(state, combatant) {
            Vue.set(state.library.bestiary, combatant.id, combatant);
        },
        destroyNPC(state, id) {
            Vue.delete(state.library.bestiary, id);
            store.dispatch('saveLibrary');
        },
        setCharacter(state, combatant) {
            Vue.set(state.library.characters, combatant.id, combatant);
        },
        destroyCharacter(state, id) {
            Vue.delete(state.library.characters, id);
            store.dispatch('saveLibrary');
        },
        saveCombatant(state, combatant) {
            store.commit(combatant instanceof NPC ? 'setNPC' : 'setCharacter', combatant);
            store.dispatch('saveLibrary');
        },
        destroyCombatant(state, combatant) {
            store.commit(combatant instanceof NPC ? 'destroyNPC' : 'destroyCharacter', combatant.id);
        },
        importLibrary(state, combatants) {
            combatants.forEach(data => {
                let combatant = Combatant.revive(data);
                store.commit(combatant instanceof NPC ? 'setNPC' : 'setCharacter', combatant);
            })
        }
    },
    actions: {
        saveLibrary(context) {
            localStorage.setItem('library', JSON.stringify(context.state.library));
        }
    }
});

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