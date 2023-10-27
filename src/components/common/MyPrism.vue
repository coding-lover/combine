<template>
    <prism :language="language" :line-numbers="true" ref="prismRef">
    11
    22
    33
    </prism>
</template>

<script>
  import 'prismjs/themes/prism.css'

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
