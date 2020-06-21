<template>
    <div id="character-editor">
        <h2>{{create? 'CREATE' : 'EDIT'}} COMBATANT <img class="close-button" src="@/assets/close.png" @click="$emit('close')"></h2>
        <combatant-view v-if="characterData" :combatant="characterData" :edit="true"></combatant-view>
        <div class="icon-btn" @click="save">
            <font-awesome-icon icon="feather-alt"/> Save character
        </div>
        <div class="icon-btn" @click="destroy">
            <font-awesome-icon icon="user-slash"/> Delete character
        </div>
    </div>
</template>

<script>
    import CombatantView from "@/components/CombatantView";
    import {Character, NPC} from "@/classes/Combatant";
    import {mapMutations} from "vuex";

    export default {
        name: "EditCharacter",
        components: {CombatantView},
        props: {
            combatant: [Character, NPC],
            type: String
        },
        data() {
            return {
                create: false,
                creatureType: this.type,
                characterData: null,
            }
        },
        computed: {
            hasChanges() {
                return this.characterData.name.length > 0 && (
                    this.create || JSON.stringify(this.characterData) !== JSON.stringify(this.combatant)
                );
            }
        },
        created() {
            if (this.type !== undefined) {
                this.create = true;
            }

            if (this.combatant === null) {
                this.create = true;
                if (this.type === 'npc') {
                    this.characterData = new this.$NPC();
                }
                else {
                    this.characterData = new this.$Character();
                }
            }
            else {
                this.characterData = this.combatant.clone();
            }
        },
        methods: {
            ...mapMutations(['saveCombatant', 'destroyCombatant']),
            save() {
                if (this.create || this.characters.currentWounds > this.characterData.stats.w) {
                    this.characterData.currentWounds = this.characterData.stats.w.valueOf();
                }

                this.saveCombatant(this.characterData);
                this.$emit('close');
            },
            destroy() {
                this.destroyCombatant(this.combatant);
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>
</style>