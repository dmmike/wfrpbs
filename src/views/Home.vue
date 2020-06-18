<template>
    <div id="home">
        <menu-bar @menu="libraryOpen=!libraryOpen"></menu-bar>
        <div id="column-container">
            <column-left class="small-column" :selected-combatant="selectedCombatant" :library="library" :library-open="libraryOpen" @new="newCharacter" @close="libraryOpen = false" @edit="edit"></column-left>
            <column-center ref="columnCenter" class="main-column" @save-combatant="saveCombatant"></column-center>
            <column-right class="small-column"></column-right>
        </div>
    </div>
</template>

<script>
    import ColumnCenter from "@/views/ColumnCenter";
    import ColumnLeft from '@/views/ColumnLeft';
    import ColumnRight from "@/views/ColumnRight";
    import MenuBar from "@/views/MenuBar";
    import {Character, NPC} from "@/classes/Combatant";
    import Stats from "@/classes/Stats";

    export default {
        name: 'Home',
        components: {
            ColumnCenter,
            ColumnLeft,
            ColumnRight,
            MenuBar
        },
        data() {
            return {
                selectedCombatant: null,
                // libraryOpen: true,
                libraryOpen: false,
                combatHasStarted: false,
                library: null,
            }
        },
        mounted() {
            this.loadData();
        },
        methods: {
            newCharacter(type = 'npc') {
                this.$refs.columnCenter.newCharacter(type);
            },
            loadData() {
                let data = JSON.parse(localStorage.getItem('library'));
                let library = {
                    bestiary: {},
                    characters: {},
                    encounters: {},
                }

                if (!data) {
                    let heske = new NPC(
                        'Heske Glazer',
                        new Stats(4, 29, 34, 33, 42, 34, 35, 49, 31, 38, 48),
                        [{name: 'Haggle', skill: 67}, {name: 'Trade (Glassblowing)', skill: 92}],
                        [{name: 'Weapon', value: 'Fist', rating: 3}],
                        [],
                        true
                    );

                    this.$set(library.bestiary, heske.id, heske);
                }
                else {
                    Object.keys(data.bestiary).forEach(id => {
                        let npc = NPC.revive(data.bestiary[id]);
                        this.$set(library.bestiary, npc.id, npc);
                    })
                }

                this.library = library;
            },
            saveCombatant(data) {
                if (data instanceof NPC) {
                    this.$set(this.library.bestiary, data.id, data);
                }
                else {
                    this.$set(this.library.characters, data.id, data);
                }
                localStorage.setItem('library', JSON.stringify(this.library));
            },
            edit(id) {
                this.$refs.columnCenter.character = this.library.bestiary[id] ? this.library.bestiary[id] : this.library.characters[id];
                this.$refs.columnCenter.createType = null;
                this.$refs.columnCenter.showCharacterEditor = true;
            }
        }
    }
</script>

<style>
    .close-button {
        display: block;
        position: absolute;
        height: 80%;
        top: 0;
        right: 5%;
        cursor: pointer;
    }

    * {
        font-size: medium !important;
    }

    h1, h2, h3, h4 {
        position:relative;
        font-family: "headerfont";
    }

    .title {
        text-align: center;
        font-weight: bold !important;
        font-size: x-large !important;
    }

    #home {
        font-family: 'textfont';
        background-image: url('~@/assets/background.jpg');
        background-size: cover;
        min-height: 100vh;
        max-height: 100vh;
        width:100%;
        padding: 0 5%;
    }

    #column-container {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        display:flex;
        flex-direction: row;
        min-height: 95vh;
        max-height: 95vh;
    }

    .small-column {
        background-image: url('~@/assets/skull-icon.png'), url('~@/assets/background-columns.png');
        background-repeat: no-repeat;
        background-size: 6vh, 400px 95vh;
        background-position: 7% 0.7%, left;
        min-width: 400px;
        max-width: 400px;
        padding: 3vh 15px 3vh;
    }

    .main-column {
        width:100%;
        padding: 0 15px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>