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
                    <th class="center clickable" width="50px" @click="toggleCombat"><font-awesome-icon :icon="initiativeIcon"/></th>
                    <th width="30%">Combatant</th>
                    <th class="center" width="80px"><font-awesome-icon icon="heart"/></th>
                    <th class="center" width="80px"><font-awesome-icon icon="balance-scale"/></th>
                    <th width="auto">Conditions/Effects</th>
                </tr>
                </thead>
                <tbody id="combat-table-body" v-if="combatants.length > 0">
                    <combat-row v-for="(combatantData, index) in combatants"
                                class="combat-row"
                                :class="{'odd-row': index%2 === 1, 'selected': selectedCombatant === combatantData, 'active-combatant': activeCombatant === combatantData}"
                                :combatant="combatantData"
                                :show-no="combatantsWithNumbers.includes(combatantData.id)"
                                :combat-started="combatStarted"
                                :initiative-type="initiativeType"
                                :key="index"></combat-row>
                </tbody>
            </table>
            <template v-if="combatStarted">
                <div class="bottom-row container">
                    <div class="row" id="combat-options">
                        <!--                                TODO: next turn button, previous turn button, finish combat button-->
                        <div class="col-1 text-right">
                            <font-awesome-icon class="clickable" icon="chevron-circle-up" @click="previousCombatant"/>
                        </div>
                        <div class="col-3">
                            <font-awesome-icon class="clickable" icon="chevron-circle-down" @click="nextCombatant"/> Next combatant
                        </div>
                        <div class="col-3"></div>
                        <div class="col-3"></div>
                        <div class="col-2" id="round-counter"><strong>Round:</strong> {{combatRound}}</div>
                    </div>
                </div>
            </template>
            <template v-if="combatants.length === 0">No combatants added yet</template>
        </div>
    </div>
</template>

<script>
    import CombatRow from "@/components/CombatRow";
    import EditCharacter from "@/components/EditCharacter";
    import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

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
                combatant: {},
                showCharacterEditor: false,
                createType: 'npc',
            }
        },
        computed: {
            ...mapState(['combatants', 'library', 'selectedCombatant', 'combatStarted', 'activeCombatant', 'combatRound']),
            ...mapGetters(['combatantsWithNumbers']),
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
                    case 'KeyN':
                        if (this.combatStarted) {
                            if (event.altKey) {
                                this.previousCombatant();
                            } else {
                                this.nextCombatant();
                            }
                        }
                }

                console.log(event);
            })
        },
        methods: {
            ...mapMutations(['ejectCombatant']),
            ...mapActions(['toggleCombat', 'nextCombatant', 'previousCombatant']),
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
        border-collapse: separate;
        border-spacing: 0px;
    }

    #combat-table thead th {
        background-color: rgba(163, 179, 175, 0.8);
        border-bottom: solid 3px black;
        border-top: none;
    }

    #combat-table th, #combat-table .combat-row td {
        padding: 0 5px;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
    }
    #combat-table .combat-row td:first-of-type, #combat-table th:first-of-type {
        border-left: none;
        padding-left: 5px;
    }

    #combat-table .combat-row td:last-of-type, #combat-table th:last-of-type {
        padding-right: 5px;
        border-right: none;
    }

    #combat-table tr:last-of-type td {
        border-bottom: 1px solid transparent;
    }

    #combat-table tr {
        line-height: 1.5em;
        min-height: 1.5em;
        overflow-x: hidden;
    }

    .combat-row {
        cursor: default;
    }
    .combat-row:hover td {
        background-color: rgba(0, 0, 0, 0.05);
    }

    #combat-table .combat-row:not(.selected) td {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    .selected td {
        border-top: 5px solid #9a1111;
        border-bottom: 5px solid #9a1111 !important;
    }
    .selected td:first-child {
        border-left: 5px solid #9a1111 !important;
        padding-left: 0;
    }
    .selected td:last-child {
        border-right: 5px solid #9a1111 !important;
        padding-right: 0;
    }

    .bottom-row.container {
        border-top: 3px solid black;
        /*border-bottom: 3px solid black;*/
        background-color: rgba(163, 179, 175, 0.80);
        padding: 0;
    }

    #combat-options>div {
        padding: 3px;
    }

    #combat-options {
        line-height: 1.5em;
        margin: 0;
        padding: 0 10px;
        cursor: default;
        -webkit-user-select: none; /* Chrome/Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+ */
    }

    .active-combatant {
        font-weight: bold;
        background: rgb(58,97,0);
        background: linear-gradient(72deg, rgba(58,97,0,0.8099614845938375) 1%, rgba(58,97,0,0.09007352941176472) 11%, rgba(250,252,249,0) 45%);
    }

    .active-combatant td:first-child {
        border-left: 5px solid #3a6100 !important;
    }

    .active-combatant td:last-child {
        border-right: 5px solid #3a6100 !important;
    }

    #round-counter strong {
        font-size: large;
    }
</style>