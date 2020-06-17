<template>
    <div id="character-editor">
        <h2>EDIT COMBATANT <img class="close-button" src="@/assets/close.png" @click="$emit('close')"></h2>
        <combatant-view v-if="characterData" :combatant="characterData" :edit="true"></combatant-view>
    </div>
</template>

<script>
    import {NPC} from "@/classes/Combatant";
    import CombatantView from "@/components/CombatantView";

    export default {
        name: "EditCharacter",
        components: {CombatantView},
        props: {
            character: [Object, null],
            type: String
        },
        data() {
            return {
                create: false,
                creatureType: this.type,
                characterData: _.clone(this.character),
            }
        },
        computed: {
            hasChanges() {
                return this.characterData.name.length > 0 && (
                    this.create || JSON.stringify(this.characterData) !== JSON.stringify(this.character)
                );
            }
        },
        mounted() {
            if (this.character === null) {
                this.create = true;

                if (this.type === 'npc') {
                    this.characterData = new NPC();
                }
            }
        },
        methods: {
            save() {
                this.$emit('save-combatant', this.characterData);
            }
        }
    }
</script>

<style scoped>
</style>