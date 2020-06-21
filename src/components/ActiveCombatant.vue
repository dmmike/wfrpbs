<template>
    <div id="active-combatant">
        <h2 class="title">Active Combatant</h2>
        <combatant-view v-if="activeCombatant && combatStarted" :combatant="activeCombatant"></combatant-view>
        <div v-else>
            Click Start Encounter to determine the round order. The stat-block for the Active Combatant will be displayed here.
        </div>
    </div>
</template>

<script>
    import CombatantView from "@/components/CombatantView";
    import {mapState} from "vuex";

    export default {
        name: "ActiveCombatant",
        components: {
            CombatantView
        },
        computed: mapState(['activeCombatant', 'combatStarted'])
    }
</script>

<style scoped>
</style>