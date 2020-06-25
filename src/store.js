import Vuex from "vuex";
import TraitsAndTalents from "@/classes/TraitsAndTalents";
import {Combatant, NPC} from "@/classes/Combatant";
import Vue from 'vue';
import Roller from "@/classes/Roller";

Vue.use(Vuex);
export const DEFAULT_SETTINGS = {
    initiativeType: 'default',
    useMaxAdvantage: false,
    autoAdvantageOnWounds: true,
    grouped: true,
}

const normalisationPerStateVersion = {
    '0.5.0': (savedState) => {
        Object.values(savedState.library.bestiary).forEach(nf.alterIsUnique);
        Object.values(savedState.combatants).filter(c => c.is_unique !== undefined).forEach(nf.alterIsUnique);
        if (savedState.activeCombatant && savedState.activeCombatant.is_unique !== undefined) nf.alterIsUnique(savedState.activeCombatant);
        if (savedState.selectedCombatant && savedState.selectedCombatant.is_unique !== undefined) nf.alterIsUnique(savedState.selectedCombatant);
    }
}

function normalizeSavedState(savedState) {
    // Sort should be unnecessary, but is a precaution since object key order is not guaranteed
    let versions = Object.keys(normalisationPerStateVersion).sort();
    let pointer = versions.indexOf(version => version === savedState.version) + 1;

    while (normalisationPerStateVersion[versions[pointer]] !== undefined) {
        normalisationPerStateVersion[versions[pointer]](savedState);
        savedState.version = versions[pointer];
        pointer++;
    }
}

// Normalizer helper functions
const nf = {
    alterIsUnique(combatant) {
        combatant.isUnique = combatant.is_unique;
    }
}

const LATEST_VERSION = Object.keys(normalisationPerStateVersion)[Object.keys(normalisationPerStateVersion).length - 1];

export const store = new Vuex.Store({
    state: {
        version: LATEST_VERSION,
        // Data
        library: {
            bestiary: {},
            characters: {},
            encounters: {},
        },

        // Combat
        combatants: [],
        activeCombatant: null,
        combatStarted: false,
        combatRound: 1,

        // Selections
        selectedCombatant: null,

        // View state
        loading: true,
        libraryOpen: false,
        libraryTab: 0,

        // Settings
        ...DEFAULT_SETTINGS
    },
    getters: {
        allTraits() {
            return TraitsAndTalents.TRAITS
        },
        combatantsWithNumbers(state) {
            let idsFound = [];
            let ids = [];
            state.combatants.forEach(combatant => {
                if (idsFound.includes(combatant.id) && !ids.includes(combatant.id)) {
                    ids.push(combatant.id);
                } else {
                    idsFound.push(combatant.id);
                }
            })
            return ids;
        },
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
            let type = combatant instanceof NPC ? 'bestiary' : 'characters';
            Vue.set(state.library[type], combatant.id, combatant);
            if (combatant.isUnique !== false) {
                let combatantInState = state.library[type][combatant.id];
                let index = state.combatants.findIndex(icc => icc.id === combatantInState.id);
                if (index > -1) {
                    combatantInState.initiative = state.combatants[index].initiative;
                    Vue.set(state.combatants, index, combatantInState);

                    if (state.selectedCombatant.id === combatantInState.id) {
                        state.selectedCombatant = state.combatants[index];
                    }
                    if (state.activeCombatant.id === combatantInState.id) {
                        state.activeCombatant = state.combatants[index];
                    }
                }
            }
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
        addCombatantAtRightSpot(state, comb) {
            let insertIndex = 0;
            let tiesToResolve = [];

            state.combatants.forEach((combatant, index) => {
                if (combatant.initiative > comb.initiative) {
                    insertIndex = index + 1;
                } else if (combatant.initiative === comb.initiative) {
                    tiesToResolve.push(combatant);
                }
            })

            if (insertIndex === state.combatants.length) {
                state.combatants.push(comb);
            } else if (tiesToResolve.length > 0) {
                tiesToResolve.push(comb);
                tiesToResolve.sort((a, b) => {
                    let results = Roller.opposedTest({target: a.stats.agi.value, modifier: 0}, {target: b.stats.agi.value, modifier: 0});
                    return results.winner === 'A' ? -1 : 1;
                })
                let indexInTie = tiesToResolve.findIndex(c => c === comb);
                insertIndex = insertIndex + indexInTie;
                if (insertIndex === state.combatants.length) {
                    state.combatants.push(comb);
                } else {
                    state.combatants.splice(insertIndex, 0, comb);
                }
            } else {
                state.combatants.splice(insertIndex, 0, comb);
            }
        },
        addCombatant(state, combatant) {
            if (combatant.isUnique === false) {
                let clone = combatant.clone();
                let highestNo = 0;
                state.combatants.forEach(c => {
                    if (c.id === combatant.id && c.no > highestNo) {
                        highestNo = c.no;
                    }
                })
                Vue.set(clone, 'no', highestNo + 1);
                Vue.set(clone, 'currentWounds', clone.stats.w);
                if (highestNo) {
                    let index = state.combatants.findIndex(c => c.id === combatant.id && c.no === highestNo) + 1;
                    Vue.set(clone, 'initiative', state.combatants[index].initiative);
                    if (index === state.combatants.length) {
                        state.combatants.push(clone);
                    } else {
                        state.combatants.splice(index, 0, clone);
                    }
                } else if (state.combatStarted) {
                    Vue.set(clone, 'initiative', clone.getInitiative());
                    store.commit('addCombatantAtRightSpot', clone);
                }
                else {
                    state.combatants.push(clone);
                }
            } else if (state.combatants.findIndex(com => com.id === combatant.id) === -1) {
                if (state.combatStarted) {
                    Vue.set(combatant, 'initiative', combatant.getInitiative());
                    store.commit('addCombatantAtRightSpot', combatant);
                } else {
                    state.combatants.push(combatant);
                }
            }
        },
        finishLoading(state, data) {
            if (data) {
                this.replaceState(data);
            }
            state.loading = false;
        },
        setLibraryTab(state, value) {
            state.libraryTab = value;
        },
        setCombatantWounds(state, {combatant, currentWounds}) {
            let combatantInState = state.combatants.find(com => com === combatant);
            if (state.autoAdvantageOnWounds && combatantInState.currentWounds > currentWounds && combatantInState.advantage > 0) {
                Vue.set(combatantInState, 'advantage', 0);
            }
            Vue.set(combatantInState, 'currentWounds', currentWounds);
            if (combatantInState.isUnique !== false) {
                store.commit('saveCombatant', combatantInState);
            }
        },
        setCombatantAdvantage(state, {combatant, advantage}) {
            let combatantInState = state.combatants.find(com => com === combatant);
            Vue.set(combatantInState, 'advantage', advantage);
        },
        toggleCombat(state) {
            state.combatStarted = !state.combatStarted;
            if (state.combatStarted) {
                state.combatRound = 1;
                state.activeCombatant = state.combatants[0];
            } else {
                state.activeCombatant = null;
                state.combatants.forEach(combatant => {
                    store.commit('setCombatantAdvantage', {combatant: combatant, advantage: 0})
                })
            }
        },
        setCombatants(state, combatants) {
            state.combatants = combatants;
        },
        setCombatantInitiative(state, {combatant, initiative}) {
            let combatantInState = state.combatants.find(com => com === combatant);
            Vue.set(combatantInState, 'initiative', initiative);
        },
        previousRound(state) {
            state.combatRound--;
        },
        nextRound(state) {
            state.combatRound++;
        },
        setActiveCombatantByIndex(state, index) {
            state.activeCombatant = state.combatants[index];
        },
    },
    actions: {
        loadData(context) {
            let savedState = JSON.parse(localStorage.getItem('savedState'));
            if (savedState) {
                if (savedState.version !== LATEST_VERSION) {
                    savedState = normalizeSavedState(savedState);
                    savedState.updated_at = now();
                    localStorage.setItem('savedState', JSON.stringify(savedState))
                }

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
                    } else {
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

            Object.keys(context.state).forEach(key => {
                if (savedState[key] === undefined) {
                    savedState[key] = context.state[key];
                }
            })
            context.commit('finishLoading', savedState);
        },
        dealDamage(context, {combatant, damage}) {
            context.commit('setCombatantWounds', {
                combatant: combatant,
                currentWounds: Math.min(Math.max(combatant.currentWounds - damage, 0), combatant.stats.w),
            })
        },
        plusAdvantage(context, combatant) {
            context.commit('setCombatantAdvantage', {combatant: combatant, advantage: combatant.advantage + 1});
        },
        minusAdvantage(context, combatant) {
            context.commit('setCombatantAdvantage', {
                combatant: combatant,
                advantage: Math.max(combatant.advantage - 1, 0)
            });
        },
        advantageToZero(context, combatant) {
            context.commit('setCombatantAdvantage', {combatant: combatant, advantage: 0});
        },
        toggleCombat(context) {
            let combat_starts = !context.state.combatStarted;
            if (combat_starts) {
                store.dispatch('determineInitiative').then(() => context.commit('toggleCombat'));
            } else {
                context.state.combatants.forEach(combatant => {
                    context.commit('setCombatantAdvantage', {combatant: combatant, advantage: 0});
                })
                context.commit('toggleCombat');
            }
        },
        determineInitiative(context) {
            let combatantsByInitiative = [];

            let initiativeType = context.state.initiativeType;
            // Step 1. Determine the initiative of each combatant
            context.state.combatants.forEach(combatant => {
                let initiative = combatant.getInitiative(initiativeType);
                if (initiativeType === 'test') {
                    if (initiative.success_levels !== 0 || initiative.success) {
                        initiative = initiative.success_levels;
                    } else {
                        initiative = -0.001
                    }
                }
                context.commit('setCombatantInitiative', {combatant: combatant, initiative: initiative});
                if (!combatantsByInitiative[initiative]) {
                    combatantsByInitiative[initiative] = [];
                }
                combatantsByInitiative[initiative].push(combatant);
            })

            // Step 2. Resolve ties
            let orderedCombatants = [];
            Object.keys(combatantsByInitiative).sort((a, b) => b - a).forEach(initiative => {
                if (combatantsByInitiative[initiative].length > 1) {
                    let tiedCombatants = combatantsByInitiative[initiative];
                    let tiedCombatantsById = {};

                    let tiesToSolve = [];
                    if (context.state.grouped) {
                        tiedCombatants.forEach(combatant => {
                            if (!tiedCombatantsById[combatant.id]) {
                                tiedCombatantsById[combatant.id] = [];
                            }
                            tiedCombatantsById[combatant.id].push(combatant);
                        })

                        let ids = Object.keys(tiedCombatantsById);
                        if (ids.length > 1) {
                            ids.forEach(id => {
                                tiesToSolve.push(tiedCombatantsById[id][0]);
                            })
                        } else {
                            let combatantsToAdd = Object.values(tiedCombatantsById)[0];
                            if (combatantsToAdd.length > 0) {
                                combatantsToAdd.sort((a, b) => a.no - b.no);
                            }
                            combatantsToAdd.forEach(combatant => {
                                orderedCombatants.push(combatant);
                            })
                        }
                    } else {
                        tiesToSolve = tiedCombatants;
                    }

                    tiesToSolve
                        .sort((a, b) => {
                            let results = Roller.opposedTest({target: a.stats.agi.value, modifier: 0}, {target: b.stats.agi.value, modifier: 0});
                            return results.winner === 'A' ? -1 : 1;
                        })
                        .forEach(combatant => {
                            if (context.state.grouped) {
                                tiedCombatantsById[combatant.id].sort((a, b) => a.no ? a.no - b.no : 0).forEach(combatant => orderedCombatants.push(combatant));
                            } else {
                                orderedCombatants.push(combatant);
                            }
                        })
                } else {
                    orderedCombatants.push(combatantsByInitiative[initiative][0])
                }
            })
            context.commit('setCombatants', orderedCombatants);
        },
        nextCombatant(context) {
            let index = context.state.combatants.findIndex(com => context.state.activeCombatant === com);
            if (index === context.state.combatants.length - 1) {
                context.commit('nextRound');
                index = 0;
            } else {
                index++;
            }

            context.commit('setActiveCombatantByIndex', index);
        },
        previousCombatant(context) {
            let index = context.state.combatants.findIndex(com => context.state.activeCombatant === com);
            if (index === 0) {
                if (context.state.combatRound === 1) return
                index = context.state.combatants.length - 1;
                context.commit('previousRound');
            } else {
                index--;
            }

            context.commit('setActiveCombatantByIndex', index);
        },
        finishCombat(context) {
            store.dispatch('toggleCombat').then(() => {
                let combatantsToEject = [];
                context.state.combatants.forEach(combatant => {
                    if (combatant instanceof NPC) {
                        combatantsToEject.push(combatant);
                    }
                })

                combatantsToEject.forEach((combatant) => context.commit('ejectCombatant', combatant));
            })
        }
    },
});

store.subscribe(({type, payload}, state) => {
    if (type === 'finishLoading') return;
    state.updated_at = now();
    localStorage.setItem('savedState', JSON.stringify(state));
})

let now = () => {
    let currentdate = new Date();
    return +currentdate.getDate() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
};