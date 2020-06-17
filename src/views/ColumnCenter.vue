<template>
    <div id="column-center">
        <edit-character v-if="showCharacterEditor"
                        :character="character"
                        :type="createType"
                        @save="saveCombatant"
                        @close="showCharacterEditor = false"
        ></edit-character>
        <div id="combat" v-else>
            <h2>COMBATANTS BY INITIATIVE</h2>
            <table id="combat-table">
                <thead id="combat-table-header">
                <tr>
                    <th>Initiative</th>
                    <th>Combatant</th>
                    <th>Wounds</th>
                    <th>Advantage</th>
                    <th>Conditions/Effects</th>
                </tr>
                </thead>
                <tbody id="combat-table-body">
                <combat-row v-for="(combatantsWithInitiative, index) in orderedCombatants"
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
            combatants: {
                type: Array,
                default: () => {
                    return [];
                }
            },
        },
        data() {
            return {
                orderedCombatants: this.combatants,
                combatStarted: false,
                character: null,
                showCharacterEditor: false,
                createType: 'npc',
            }
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
                    combatant.initiative = initiative
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
                this.character = null;
                this.createType = type;
                this.showCharacterEditor = true;
            },
            saveCombatant(combatant) {
                this.$emit('save-combatant', combatant);
            }
        }
    }
</script>

<style scoped>

    #column-center {
        padding-top: 3vh
    }

    #combat-table {
        width: 100%;
        margin: 0;
    }

</style>