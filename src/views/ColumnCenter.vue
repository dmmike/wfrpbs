<template>
    <div id="column-center">
        <edit-character v-if="showCharacterEditor"
                        :combatant="combatant"
                        :type="createType"
                        @close="showCharacterEditor = false"
        ></edit-character>
        <div id="combat" v-else>
            <h2>COMBATANTS BY INITIATIVE</h2>
            <table id="combat-table">
                <thead id="combat-table-header">
                <tr>
                    <th class="center" width="50px"><font-awesome-icon :icon="initiativeIcon"/></th>
                    <th width="30%">Combatant</th>
                    <th class="center" width="80px"><font-awesome-icon icon="heart"/></th>
                    <th class="center" width="80px"><font-awesome-icon icon="balance-scale"/></th>
                    <th width="auto">Conditions/Effects</th>
                </tr>
                </thead>
                <tbody id="combat-table-body" v-if="combatants.length > 0">
                    <combat-row v-for="(combatantData, index) in combatants"
                                :class="{'odd-row': index%2 === 1, 'selected': selectedCombatant === combatantData}"
                                :combatant="combatantData"
                                :show-no="combatantsWithNumbers.includes(combatantData.id)"
                                :combat-started="combatStarted"
                                :initiative-type="initiativeType"
                                :key="index"></combat-row>
                </tbody>
            </table>
            <template v-if="combatants.length === 0">No combatants added yet</template>
        </div>
    </div>
</template>

<script>
    import Roller from "@/classes/Roller";
    import CombatRow from "@/components/CombatRow";
    import EditCharacter from "@/components/EditCharacter";
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "ColumnCenter",
        components: {
            CombatRow,
            EditCharacter
        },
        props: {
            grouped: {
                type: Boolean,
                default: true
            },
            initiativeType: {
                type: String
            },
        },
        data() {
            return {
                combatStarted: false,
                combatant: {},
                showCharacterEditor: false,
                createType: 'npc',
            }
        },
        computed: {
            ...mapState(['combatants', 'library', 'selectedCombatant']),
            combatantsWithNumbers() {
                let idsFound = [];
                let ids = [];
                this.combatants.forEach(combatant => {
                    if (idsFound.includes(combatant.id) && !ids.includes(combatant.id)) {
                        ids.push(combatant.id);
                    } else {
                        idsFound.push(combatant.id);
                    }
                })
                return ids;
            },
            initiativeIcon() {
                return this.combatStarted ? 'bolt' : 'bed';
            },
        },
        created() {
            this.$root.$on('edit-combatant', this.edit);
            this.$root.$on('new-combatant', this.newCombatant);
        },
        mounted() {
            window.addEventListener("keydown", (event) => {
                if (event.target !== document.body) return;
                switch (event.code) {
                    case 'Delete':
                        if (this.selectedCombatant) this.ejectCombatant(this.selectedCombatant);
                        break;
                }
            })
        },
        methods: {
            ...mapMutations(['ejectCombatant']),
            determineInitiative() {
                let combatantsByInitiative = [];

                // Step 1. Determine the initiative of each combatant
                this.combatants.forEach(combatant => {
                    let initiative = combatant.getInitiative(this.initiativeType);
                    if (this.initiativeType === 'test') {
                        if (initiative.success_levels !== 0 || initiative.success) {
                            initiative = initiative.success_levels;
                        } else {
                            initiative = -0.001
                        }
                    }
                    combatant.initiative = initiative;
                    if (!combatantsByInitiative[initiative]) {
                        this.$set(combatantsByInitiative, initiative, []);
                    }
                    combatantsByInitiative[initiative].push(combatant);
                })

                // Step 2. Resolve ties
                let orderedCombatants = [];
                Object.keys(combatantsByInitiative).forEach(initiative => {
                    if (combatantsByInitiative[initiative].length > 1) {
                        let tiedCombatants = combatantsByInitiative[initiative];
                        let tiedCombatantsById = {};

                        let tiesToSolve = [];
                        if (this.grouped) {
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
                            }
                        } else {
                            tiesToSolve = tiedCombatants;
                        }

                        tiesToSolve.sort((a, b) => {
                            let results = Roller.opposedTest(a.stats.agi.value, b.stats.agi.value);
                            return results.winner === 'A' ? -1 : 1;
                        }).forEach(combatant => {
                            if (this.grouped) {
                                tiedCombatantsById[combatant.id].sort((a, b) => a.no - b.no).forEach(combatant => orderedCombatants.push(combatant));
                            } else {
                                orderedCombatants.push(combatant);
                            }
                        })
                    } else {
                        orderedCombatants.push(combatantsByInitiative[initiative][0])
                    }
                })

                this.$set(this, 'combatants', orderedCombatants);
            },
            newCombatant(type) {
                //TODO: Implement warning when character already selected
                this.combatant = null;
                this.createType = type;
                this.showCharacterEditor = true;
            },
            edit(combatant) {
                this.combatant = combatant.clone();
                this.createType = null;

                if (combatant instanceof this.$NPC) {
                    if (this.library.bestiary[combatant.id] === undefined) {
                        this.createType = 'npc';
                    }
                }
                else if (this.library.characters[combatant.id] === undefined) {
                    this.createType = 'character';
                }

                this.showCharacterEditor = true;
            },
        }
    }
</script>

<style>
    #column-center {
        padding-top: 3vh
    }

    #combat-table {
        width: 100%;
        margin: 0;
        border-collapse: collapse;
    }

    #combat-table thead {
        background-color: rgba(163, 179, 175, 0.8);
        border-bottom: solid 3px black;
    }

    #combat-table thead th {
        border-top: none;
    }

    #combat-table th, #combat-table tbody td {
        padding: 0 5px;
        border: 1px solid black;
    }
    #combat-table th:first-of-type, #combat-table th:last-of-type,
    #combat-table td:first-of-type, #combat-table td:last-of-type {
        border-left: none;
        border-right: none;
    }

    #combat-table tr:last-of-type td {
        border-bottom: none;
    }

    #combat-table tr {
        line-height: 1.7em;
        min-height: 1.7em;
        overflow-x: hidden;
    }

    #combat-table tbody tr:hover td {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .selected {
        border: 3px solid #720303;
    }
</style>