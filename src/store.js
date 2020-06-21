import Vuex from "vuex";
import TraitsAndTalents from "@/classes/TraitsAndTalents";
import {Combatant, NPC} from "@/classes/Combatant";
import Vue from 'vue';

Vue.use(Vuex);

export const store = new Vuex.Store({
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