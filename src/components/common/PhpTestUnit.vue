<template>
    <div class="container">
        <h3>{{title}}</h3>
        <el-collapse accordion>
            <el-collapse-item>
                <template slot="title">
                    {{func}} <i class="header-icon el-icon-document"></i>
                </template>
                <my-prism  :plugins="plugins" style="height: 300px;overflow-y: auto"><slot name="u-code"></slot></my-prism>
            </el-collapse-item>
        </el-collapse>

        <form-create v-model="fApi" :rule="fRules" :option="fOptions" class="mt-10"></form-create>
        <el-collapse value="1" accordion>
            <el-collapse-item name="1">
                <template slot="title" >
                    结果 <i class="header-icon el-icon-document"></i>
                </template>
                <json-viewer :value="result" :expand-depth="5" boxed></json-viewer>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>


<script>
    import MyPrism from "./MyPrism";
    export default {
        props: {
            title: {
                type: String,
                default: '',
            },
            func: {
                type: String,
                default: '',
            },
            rules: {
                type: Array,
                default: function() {
                    return [];
                },
            },
            options: {
                type: Object,
                default: function() {
                    return {};
                },
            },
        },
        data () {
            return {
                plugins: ['line-numbers'],
                targetFunc: null,
                result: {},

                //form-create
                fApi: {},
                fOptions: {},
                fRules: [],
                defaultRules: [
                    {
                        type: 'el-button',
                        field: 'submitBtn',
                        on: {
                            click: () => {
                                //TODO 提交表单
                                this.onSubmit(this.fApi);
                            }
                        },
                        props: {
                            type: 'primary',
                        },
                        col: {
                            //span:3,
                            //spush: 1
                        },
                        children: ['提交']

                    }
                ],
                defaultOptions: {
                    form: {
                        //行内表单模式
                        inline: true,
                        labelWidth: 'auto',
                    },
                    row: {
                        //justify: 'start',
                    },
                    submitBtn: false,
                },
            }
        },
        components: {
            MyPrism
        },
        computed: {
        },
        created() {
            this.fRules.push(...this.rules, ...this.defaultRules);
            this.fOptions = Object.assign(this.options, this.defaultOptions);
        },
        mounted() {


        },
        methods: {
            enableSubmit(flag = true) {
                this.fApi.disabled(!flag, 'submitBtn');
            },
            onSubmit(fApi) {
                fApi.validate((valid) => {
                    if(!valid) {
                        return false;
                    }

                    if(!this.checkFunc(this.func))
                    {
                        return false;
                    }

                    console.log(this.targetFunc);

                    this.enableSubmit(false);
                    this.targetFunc(fApi.form).then(res => {
                        console.log(res);
                        if(res.code) {
                            this.$notify({
                                title: '错误',
                                message: `#${this.$props.func}获取失败 <br /> ${res.msg}`,
                                type: 'error'
                            });
                            this.result = res.payload;
                            return false;
                        }

                        this.result = res.payload;
                        this.$notify({
                            title: '成功',
                            message: `#${this.$props.func}  获取成功`,
                            type: 'success'
                        });
                    }).finally(() => {
                        this.enableSubmit(true);
                    });
                });
            },

            checkFunc(func) {
                let tmp = require('../../api/accounts');
                if(!tmp || !tmp[func])
                {
                    this.targetFunc = null;
                    this.$notify.error({title: '错误', message: func + ' 方法找不到！'});
                    return false;
                }

                this.targetFunc = tmp[func];
                return true;
            }
        }
    }
</script>

<style scoped>
    h1{
        text-align: center;
        margin: 30px 0;
    }
    p{
        line-height: 30px;
        margin-bottom: 10px;
        text-indent: 2em;
    }
    .logout{
        color: #409EFF;
    }
    .mt-5 {
        margin-top: 5px;
    }
    .mt-10 {
        margin-top: 5px;
    }

</style>
