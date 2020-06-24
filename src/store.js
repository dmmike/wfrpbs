import Vuex from "vuex";
import TraitsAndTalents from "@/classes/TraitsAndTalents";
import {Combatant, NPC} from "@/classes/Combatant";
import Vue from 'vue';

Vue.use(Vuex);
export const DEFAULT_SETTINGS = {
    initiativeType: 'default',
    useMaxAdvantage: false,
}

export const store = new Vuex.Store({
    state: {
        // Data
        library: {
            bestiary: {},
            characters: {},
            encounters: {},
        },
        combatants: [],
        parties: [],

        // Selections
        activeCombatant: null,
        selectedCombatant: null,

        // View state
        loading: true,
        combatStarted: false,
        libraryOpen: false,

        // Settings
        ...DEFAULT_SETTINGS
    },
    getters: {
        allTraits() {return TraitsAndTalents.TRAITS},
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
        saveCombatant(state, combatant) {
            Vue.set(state.library[combatant instanceof NPC ? 'bestiary' : 'characters'], combatant.id, combatant);
        },
        destroyCombatant(state, combatant) {
            Vue.delete(state.library[combatant instanceof NPC ? 'bestiary' : 'characters'], combatant.id);
        },
        ejectCombatant(state, combatant) {
            let no = combatant.no;
            state.combatants.splice(state.combatants.findIndex(c => {
                return c.id === combatant.id && c.no === no;
            }), 1);

            if (combatant === state.selectedCombatant) store.commit('deselectCombatant');
        },
        addCombatant(state, combatant) {
            if (combatant.is_unique === false) {
                let clone = combatant.clone();
                let highestNo = 0;
                state.combatants.forEach(c => {
                    if (c.id === combatant.id && c.no > highestNo) {
                        highestNo = c.no;
                    }
                })
                Vue.set(clone, 'no', highestNo + 1);
                Vue.set(clone, 'currentWounds', clone.stats.w);
                Vue.set(clone, 'initiative', clone.getInitiative());
                state.combatants.push(clone);
            }
            else if (state.combatants.findIndex(com => com.id === combatant.id) === -1) {
                Vue.set(combatant, 'initiative', combatant.getInitiative());
                state.combatants.push(combatant);
            }
        },
        finishLoading(state, data) {
            if (data) {
                this.replaceState(data);
            }
            state.loading = false;
        },
        setCombatantWounds(state, {combatant, currentWounds}) {
            let combatantInState = state.combatants.find(com => com === combatant);
            Vue.set(combatantInState, 'currentWounds', currentWounds);
        },
        saveParty(state, party) {
            let p = state.parties.findIndex(par => par.id === party.id);
            if (p !== -1) {
                Vue.set(state.parties, p, party);
            }
            else {
                state.parties.push(party);
            }
        }
    },
    actions: {
        loadData(context) {
            let savedState = JSON.parse(localStorage.getItem('savedState'));
            if (savedState) {
                let reviveCombatant = (combatant) => {
                    if (combatant === null) return null;
                    let revived = Combatant.revive(combatant);
                    if (combatant.no) revived.no = combatant.no;
                    return revived;
                }
                let reviveCombatants = (combs) => {
                    let revived;
                    if (Array.isArray(combs)) {
                        revived = [];
                        combs.forEach(combatant => revived.push(reviveCombatant(combatant)));
                    }
                    else {
                        revived = {};
                        Object.keys(combs).forEach(id => {
                            Vue.set(revived, id, reviveCombatant(combs[id]));
                        })
                    }
                    return revived;
                }
                //Revive all combatants
                savedState.library.bestiary = reviveCombatants(savedState.library.bestiary);
                savedState.library.characters = reviveCombatants(savedState.library.characters);
                savedState.combatants = reviveCombatants(savedState.combatants);
                if (savedState.selectedCombatant) {
                    let com = savedState.selectedCombatant;
                    savedState.selectedCombatant = savedState.combatants.find(co => co.id === com.id && co.no === com.no);
                }
                if (savedState.activeCombatant) {
                    let com = savedState.activeCombatant;
                    savedState.activeCombatant = savedState.combatants.find(co => co.id === com.id && co.no === com.no);
                }
            }

            context.commit('finishLoading', savedState);
        },
        dealDamage(context, {combatant, damage}) {
            context.commit('setCombatantWounds', {
                combatant: combatant,
                currentWounds: Math.min(Math.max(combatant.currentWounds - damage, 0), combatant.stats.w),
            })
        }
    },
});

store.subscribe(({type, payload}, state) => {
    if (type === 'finishLoading') return;
    localStorage.setItem('savedState', JSON.stringify(state));
})