<template>
    <div id="column-right">
        <transition name="fade" mode="out-in">
            <div v-if="selectedCombatant">
                <h2 class="title">Selected Combatant <img class="close-button" src="@/assets/close.png" @click="deselectCombatant"></h2>
                <combatant-view :component-max-width="370" :combatant="selectedCombatant"></combatant-view>
            </div>
            <h2 class="title" v-else>No Combatant Selected</h2>
        </transition>
    </div>
</template>

<script>
    import CombatantView from "@/components/CombatantView";
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "ColumnRight",
        components: {
            CombatantView
        },
        computed: {
            ...mapState(['selectedCombatant'])
        },
        methods: {
            ...mapMutations(['deselectCombatant'])
        }
    }
</script>