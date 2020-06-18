<template>
    <div id="bestiary-content">
        <div id="list">
            <input type="search" v-model="filter" style="width:100%;">
            <ul id="bestiary">
                <li :class="index%2 === 0 ? 'odd-row' : 'even-row'" v-for="(combatant, index) in filteredBestiary" :key="index">
                    <v-tooltip open-delay="500" right>
                        <template v-slot:activator="{ on, attrs }">
                            <span class="combatant-line" style="width:100%" v-bind="attrs" v-on="on" @mouseenter="hover = index">
                                {{combatant.name}}
                                <span v-if="hover === index" class="combatant-options">
                                    <span @click="edit(combatant.id)">
                                        Edit
                                    </span>
                                </span>
                            </span>
                        </template>
                        <combatant-view style="color:black" :combatant="combatant" :edit="false"></combatant-view>
                    </v-tooltip>
                </li>
            </ul>
        </div>
        <div id="button-row">
            <button id="add-combatant" @click="newCharacter">+ Add New</button>
        </div>
    </div>
</template>

<script>
    import CombatantView from "@/components/CombatantView";
    export default {
        name: "BestiaryContent",
        components: {CombatantView},
        props: {
            bestiary: Object
        },
        data() {
            return {
                filter: '',
                hover: null,
            }
        },
        computed: {
            filteredBestiary() {
                return Object.values(this.bestiary).filter(c => this.filter === '' || c.name.includes(this.filter)).sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });
            }
        },
        methods: {
            isOddRow(id) {
                return Object.keys(this.filteredBestiary).findIndex(key => key === id )%2;
            },
            edit(id) {
                this.$root.$emit('edit-combatant', id);
            },
            newCharacter() {
                this.$root.$emit('new-combatant', 'npc');
            }
        }
    }
</script>

<style scoped>
    #bestiary-content {
        width: 100%;
        max-height: 100%;
    }

    #bestiary {
        margin-top: 1vh;
        display: block;
        list-style-type: disc;
        padding-inline-start: 0;
    }

    #bestiary li {
        border-top: 2px solid black;
        padding-left: 6px;
        height: 1.7em;
        list-style-type: none;
        display: flex;
        overflow-x: hidden;
    }

    .odd-row {
        background-color: rgba(188, 202, 199, 0.8);
    }


    .even-row {
        background-color: rgba(255, 255, 255, 0.8);
    }

    #list {
        height: calc(100vh - 30px - 1vh - 5vh - 20vh);
    }

    #button-row {
        height: 30px;
    }

    #add-combatant {
        float: right;
    }

    .combatant-options {
        float:right;
    }
</style>