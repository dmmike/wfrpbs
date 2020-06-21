<template>
    <transition name="fade">
        <div class="modal-mask" v-if="active" @mousedown="killModal">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <h2 class="title"><slot name="title">Title</slot></h2>
                    <div id="body">
                        <slot name="default"></slot>
                    </div>
                    <div id="buttons">
                        <slot name="buttons"></slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "EditModal",
        props: {
            active: Boolean
        },
        methods: {
            killModal(event) {
                if (
                    !event.path.some(el => {
                        return el.classList && el.classList.contains('modal-container')
                    })
                ) {
                    this.$emit('close');
                }
            },
        }
    }
</script>

<style scoped>

    #body{
        height: calc(100% - 65px);
    }

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        display: table;
        transition: opacity 0.3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        position:relative;
        width: 500px;
        height: 635px;
        margin: 0 auto;
        padding: 30px 40px;
        background-color: transparent;
        background-image: url('~@/assets/pagebackground.png');
        background-size: 100% 100%;
        border-radius: 30px;
    }

    h2 {
        font-size: x-large !important;
    }
</style>