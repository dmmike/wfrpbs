<template>
    <div id="column-right">
        <template v-if="selectedCombatant">
            <h2 class="title">Selected Combatant <img class="close-button" src="@/assets/close.png" @click="selectedCombatant = null"></h2>
            <combatant-view :combatant="selectedCombatant"></combatant-view>
        </template>
        <template v-else>
            <h2 class="title">No Combatant Selected</h2>
        </template>
    </div>
</template>

<script>
    import CombatantView from "@/components/CombatantView";

    export default {
        name: "ColumnRight",
        components: {
            CombatantView
        },
        data() {
            return {
                selectedCombatant: null
            }
        },
        mounted() {
            this.$root.$on('select-combatant', (combatant) => this.selectedCombatant = _.cloneDeep(combatant));
        },
    }
</script>

<style scoped>

</style>