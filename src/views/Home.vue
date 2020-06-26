<template>
    <div id="home">
        <div id="home-container">
            <transition name="fade" mode="out-in">
                <div v-if="loading">
                    Loading...
                </div>
                <div v-else>
                    <menu-bar></menu-bar>
                    <div id="column-container">
                        <column-left class="small-column" @new="newCharacter"></column-left>
                        <column-center ref="columnCenter" class="main-column"></column-center>
                        <column-right class="small-column"></column-right>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import ColumnCenter from "@/views/ColumnCenter";
    import ColumnLeft from '@/views/ColumnLeft';
    import ColumnRight from "@/views/ColumnRight";
    import MenuBar from "@/views/MenuBar";
    import {mapMutations, mapState} from "vuex";

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
                combatHasStarted: false,
            }
        },
        computed: {
            ...mapState(['loading'])
        },
        methods: {
            ...mapMutations(['openLibrary', 'destroyNPC', 'destroyCharacter']),
            newCharacter(type = 'npc') {
                this.$refs.columnCenter.newCharacter(type);
            },
        }
    }
</script>

<style>
    .clickable {
        cursor:pointer;
    }

    .odd-row {
        background-color: rgba(188, 202, 199, 0.8);
        -webkit-user-select: none; /* Chrome/Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+ */
    }


    .even-row {
        background-color: rgba(255, 255, 255, 0.8);
        -webkit-user-select: none; /* Chrome/Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+ */
    }

    .center {
        text-align: center;
    }

    .close-button {
        display: block;
        position: absolute;
        height: 80%;
        top: 0;
        right: 5%;
        cursor: pointer;
    }

    * {
        font-size: medium;
    }

    #home h1,#home h2,#home h3,#home h4 {
        font-size: unset;
        position:relative;
        font-family: "headerfont";
    }

    .title {
        text-align: center;
        font-weight: bold;
        font-size: x-large;
    }

    #home {
        font-family: 'textfont';
        background-image: url('~@/assets/background.jpg');
        background-size: cover;
        min-height: 100vh;
        max-height: 100vh;
        width:100%;
        min-width: 1500px;
    }

    #home-container {
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

    .icon-btn {
        display: inline-block;
        line-height: 40px;
        margin: 15px;
        height: 40px;
        cursor: pointer;
    }

    .icon-btn *:not(span) {
        position: relative;
        top: -3px;
        height: 40px;
        margin: 0 10px;
        font-size: 20px;
        vertical-align: middle;
        text-align: center;
    }
</style>