<template>
    <prism :language="language" :plugins="plugins" :code="html" ref="prismRef"><slot></slot></prism>
</template>

<script>

    export default {
        name: 'MyPrism',

        data() {
            return {
                html: this.$props.code
            }
        },

        props: {
            language: {
                type: String,
                default: 'php'
            },

            plugins: {
                type: Array,
                default: 'plugins'
            },

            code: {
                //type: String,
                default: ''
            },

        },

        mounted() {
            if(this.$slots.default) {
                this.html = this.$slots.default[0].text;
            }
        }
    }

</script>


<style >

</style>
