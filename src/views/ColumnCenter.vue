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
                    <th class="center" width="50px"><font-awesome-icon icon="bolt"/></th>
                    <th width="30%">Combatant</th>
                    <th class="center" width="80px"><font-awesome-icon icon="heart"/></th>
                    <th class="center" width="80px"><font-awesome-icon icon="balance-scale"/></th>
                    <th width="auto">Conditions/Effects</th>
                </tr>
                </thead>
                <tbody id="combat-table-body">
                    <tr v-if="combatLines.length === 0">
                        <td colspan="5">
                            No combatants added yet
                        </td>
                    </tr>
                    <combat-row v-for="(combatantWithInitiative, index) in combatLines"
                                :class="{'odd-row' : index%2 === 1}"
                                :combatant="combatantWithInitiative"
                                :show-no="combatantsWithNumbers.includes(combatantWithInitiative.id)"
                                @remove="removeCombatant(combatantWithInitiative)"
                                :initiative-type="initiativeType" :key="index"></combat-row>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import Roller from "@/classes/Roller";
    import CombatRow from "@/components/CombatRow";
    import EditCharacter from "@/components/EditCharacter";

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
                orderedCombatants: [],
                combatStarted: false,
                combatants: [],
                combatant: {},
                showCharacterEditor: false,
                createType: 'npc',
            }
        },
        computed: {
            combatLines() {
                return this.orderedCombatants.length ? this.orderedCombatants : this.combatants;
            },
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
            }
        },
        mounted() {
            this.$root.$on('edit-combatant', this.edit);
            this.$root.$on('new-combatant', this.newCharacter);
            this.$root.$on('add-to-combat', this.addToCombat)
        },
        methods: {
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
                                tiedCombatantsById[combatant.id].forEach(combatant => orderedCombatants.push(combatant));
                            } else {
                                orderedCombatants.push(combatant);
                            }
                        })
                    } else {
                        orderedCombatants.push(combatantsByInitiative[initiative][0])
                    }
                })

                this.orderedCombatants = orderedCombatants;
            },
            newCharacter(type) {
                //TODO: Implement warning when character already selected
                this.combatant = null;
                this.createType = type;
                this.showCharacterEditor = true;
            },
            saveCombatant(combatant) {
                this.combatant = null;
                this.showCharacterEditor = false;
                this.$emit('save-combatant', combatant);
            },
            edit(combatant) {
                let library = JSON.parse(localStorage.getItem('library'));
                this.combatant = _.clone(combatant);
                this.createType = null;

                if (combatant instanceof this.$NPC) {
                    if (library.bestiary[combatant.id] === undefined) {
                        this.createType = 'npc';
                    }
                }
                else if (library.characters[combatant.id] === undefined) {
                    this.createType = 'character';
                }

                this.showCharacterEditor = true;
            },
            addToCombat(combatant) {
                if (combatant.is_unique === false) {
                    let clone = _.clone(combatant);
                    let highestNo = 0;
                    this.combatants.forEach(c => {
                        if (c.id === combatant.id && c.no > highestNo) {
                            highestNo = c.no;
                        }
                    })
                    this.$set(clone, 'no', highestNo + 1);
                    this.$set(clone, 'currentWounds', clone.stats.w);
                    this.$set(clone, 'initiative', clone.getInitiative());
                    this.combatants.push(clone);
                }
                else if (this.combatants.findIndex(com => com.id === combatant.id) === -1) {
                    this.$set(combatant, 'initiative', combatant.getInitiative());
                    this.combatants.push(combatant);
                }
            },
            removeCombatant(combatant) {
                let no = combatant.no;
                this.combatants.splice(this.combatants.findIndex(c => {
                    return c.id === combatant.id && c.no === no;
                }), 1);
            }
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
        border-style: hidden;
    }

    #combat-table thead {
        background-color: rgba(163, 179, 175, 0.8);
        border-bottom: solid 3px black;
    }

    #combat-table th, #combat-table tbody td {
        padding: 0 5px;
        border: 1px solid black;
    }

    #combat-table tr {
        line-height: 1.7em;
        min-height: 1.7em;
        overflow-x: hidden;
    }

</style>