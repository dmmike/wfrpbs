<template>
    <div id="library">
        <h2 class="title">Library <img class="close-button" src="@/assets/close.png" @click="closeLibrary"></h2>
        <div id="tabs" class="row">
            <div class="col" :class="{active: tab===0}" @click="tab=0">
                <transition name="banner">
                    <img v-if="tab===0" src="@/assets/banner.png">
                </transition>
                <span class="tab-title">Bestiary</span>
            </div>
            <div class="col" :class="{active: tab===1}" @click="tab=1">
                <transition name="banner">
                    <img v-if="tab===1" src="@/assets/banner.png">
                </transition>
                <span class="tab-title">Characters</span>
            </div>
            <div class="col" :class="{active: tab===2}" @click="tab=2">
                <transition name="banner">
                    <img v-if="tab===2" src="@/assets/banner.png">
                </transition>
                <span class="tab-title">Encounters</span>
            </div>
        </div>

        <div id="library-content">
            <transition name="fade" mode="out-in">
                <bestiary-content key="npcs" :npcs="true" :bestiary="library.bestiary" v-if="tab===0"></bestiary-content>
                <bestiary-content key="characters" :npcs="false" :bestiary="library.characters" v-if="tab===1"></bestiary-content>
<!--                <encounters-content :encounters="library.encounters" v-if="tab===2"></encounters-content>-->
            </transition>
        </div>
    </div>
</template>

<script>
    import BestiaryContent from "@/components/library_components/BestiaryContent";
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "Library",
        components: {
            BestiaryContent
        },
        computed: mapState(['library']),
        data() {
            return {
                tab: 0
            }
        },
        methods: {
            ...mapMutations(['closeLibrary'])
        }
    }
</script>

<style scoped>
    .title {
        position: relative;
    }

    #tabs {
        margin-top: 20px;
    }

    #tabs > div {
        padding: 0;
    }

    .tab-title {
        color: black;
        width: 100%;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        position: relative;
    }

    .tab-title::before, .tab-title::after {
        content: " ◆ "
    }

    #tabs img {
        transform-origin: top;
        display: revert;
        position: absolute;
        margin: 0 5%;
        top: 0;
        width: 90%;
        z-index: 0;
    }

    #library-content {
        top: 5vh;
        position: relative;
        height:100%;

    }

    .banner-enter-active {
        animation: shrink .5s;
    }

    .banner-leave-active {
        animation: shrink .5s reverse;
    }

    #library {
        padding: 0 5%;
    }

    @keyframes shrink {
        0% {
            transform: scaleY(0);
        }

        100% {
            transform: scaleY(1);
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>