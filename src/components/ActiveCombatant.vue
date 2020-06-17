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
    import {Combatant} from "@/classes/Combatant";
    import CombatantView from "@/components/CombatantView";

    export default {
        name: "ActiveCombatant",
        components: {
            CombatantView
        },
        props: {
            activeCombatant: Combatant,
            combatStarted: {
                type: Boolean,
                default: false,
            }
        }
    }
</script>

<style scoped>
</style>