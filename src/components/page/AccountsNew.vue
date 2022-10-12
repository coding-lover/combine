<template>

<div>
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-notice"></i>仓位测试</el-breadcrumb-item>
            <el-breadcrumb-item>账号测试Multi</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="container">
        <el-tabs v-model="activeName" @tab-click="">
            <el-tab-pane label="单个" name="single">
                <div>
                    <el-row :gutter="5" >
                        <el-col>
                            <accounts-test-unit :title="single.title"  :rules="single.rules">
                                <template v-slot:u-code>{{single.code}}</template>
                            </accounts-test-unit>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="主动" name="restful">
                <div class="">
                    <el-row :gutter="5" v-for="(item, key) in restful">
                        <el-col :span="item.colSpan" v-for="(params, key) in item.config">
                            <accounts-test-unit :title="params.title" :func="params.func" :rules="params.rules">
                                <template v-slot:u-code>{{params.code}}</template>
                            </accounts-test-unit>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="缓存" name="cache">
                <div>
                    <el-row :gutter="5" v-for="(item, key) in cache">
                        <el-col :span="item.colSpan" v-for="(params, key) in item.config">
                            <accounts-test-unit :title="params.title" :func="params.func" :rules="params.rules">
                                <template v-slot:u-code>{{params.code}}</template>
                            </accounts-test-unit>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="混合" name="recoup">
                <div>
                    <el-row :gutter="5" v-for="(item, key) in mix">
                        <el-col :span="item.colSpan" v-for="(params, key) in item.config">
                            <accounts-test-unit :title="params.title" :func="params.func" :rules="params.rules">
                                <template v-slot:u-code>{{params.code}}</template>
                            </accounts-test-unit>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="集合" name="collect">
                <div>
                    <el-row :gutter="5" v-for="(item, key) in collect">
                        <el-col :span="item.colSpan" v-for="(params, key) in item.config">
                            <accounts-test-unit :title="params.title" :func="params.func" :rules="params.rules">
                                <template v-slot:u-code>{{params.code}}</template>
                            </accounts-test-unit>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>
            <el-tab-pane label="主动/混合" name="balanceSummary">
                <div>
                    <el-row :gutter="5" v-for="(item, key) in balanceSummary">
                        <el-col :span="item.colSpan" v-for="(params, key) in item.config">
                            <accounts-test-unit :title="params.title" :func="params.func" :rules="params.rules">
                                <template v-slot:u-code>{{params.code}}</template>
                            </accounts-test-unit>
                        </el-col>
                    </el-row>
                </div>
            </el-tab-pane>


        </el-tabs>
    </div>

</div>

</template>


<script>
    import AccountsTestUnit from "../common/AccountsTestUnit";
    export default {
        name: 'accountsNew',
        data () {
            return {
                activeName: 'single',
                restful: [
                    {
                        colSpan: 8,
                        config: [
                            {
                                title: '现货资产',
                                func: 'getSpotBalanceById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    }
                                ],
                                code: `public function getSpotBalanceById($taid)
    {
        try {
            $exInfo = $this->getSummaryAccount($this->regnumber, $taid);
            if(empty($exInfo))
                throw new \\Exception('账户不存在22.');

            $balance = $this->getPositionSpot(self::ALL_SYMBOL, $exInfo);

            return $this->ret($balance);
        } catch (\\Exception $e) {
            return $this->err($e->getMessage());
        }
    }`,
                            },
                            {
                                title: '杠杆资产',
                                func: 'getMarginBalanceById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    }
                                ],
                                code: `public function getMarginBalanceById($taid)
    {
        try {
            $exInfo = $this->getSummaryAccount($this->regnumber, $taid);
            if(empty($exInfo))
                throw new \\Exception('账户不存在.');

            $balance = $this->getMarginBalance(self::ALL_SYMBOL, $exInfo, true);

            return $this->ret($balance);
        } catch (\\Exception $e) {
            return $this->err($e->getMessage());
        }
    }`,
                            },
                            {
                                title: '杠杆信息',
                                func: 'getMarginInfoById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'mode',
                                        title: '模式',
                                        value: 'all',
                                        options: [
                                            {value: 'all', label: '全部'},
                                            {value: 'crossed', label: '全仓'},
                                            {value: 'fixed', label: '逐仓'},
                                        ],
                                        validate: [{required: true, message: '不能为空'}]
                                    },

                                ],
                                code: `/**
     * @desc
     * @param $taid
     * @param string $mode [ all | fixed | crossed ]
     * @author wmc
     * @date 2019-11-15 11:49
     * "fixed" => [...],
     * "crossed" => [...],
     */
    public function getMarginInfoById($taid, $mode = 'all')
    {
        try {
            $exInfo = $this->getSummaryAccount($this->regnumber, $taid);
            if(empty($exInfo))
                throw new \\Exception('账户不存在.');

            $balance = $this->AccountSource->fetchMarginBalanceRaw($exInfo);

            return $this->ret($balance);
        } catch (\\Exception $e) {
            return $this->err($e->getMessage());
        }
    }`,
                            },

                        ]
                    },

                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '交割资产',
                                func: 'getFutureBalanceById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    }
                                ],
                                code: `/**
     * @desc  期货
     * @param $taid
     * @author wmc
     * @date 2019-11-06 17:28
     */
    public function getFutureBalanceById($taid)
    {
        try {
            $exInfo = $this->getSummaryAccount($this->regnumber, $taid);
            if(empty($exInfo))
                throw new \\Exception('账户不存在.');

            $balance = $this->getFutureBalance(self::ALL_SYMBOL, $exInfo);

            return $this->ret($balance);
        } catch (\\Exception $e) {
            return $this->err($e->getMessage());
        }
    }`,
                            },
                            {
                                title: '交割仓位',
                                func: 'getFuturePositionAllById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    }
                                ],
                                code: `/**
     * @desc  期货仓位 all
     * @param $taid
     * @author wmc
     * @date 2019-11-06 17:36
     */
    public function getFuturePositionAllById($taid)
    {
        try {
            $exInfo = $this->getSummaryAccount($this->regnumber, $taid);
            if(empty($exInfo))
                throw new \\Exception('账户不存在.');

            $position = $this->getPositionFutureAll($exInfo);

            return $this->ret($position);
        } catch (\\Exception $e) {
            return $this->err($e->getMessage());
        }
    }`,
                            },
                        ],
                    },

                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '永续资产',
                                func: 'getSwapBalanceById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    }
                                ],
                                code: `/**
     * @desc  永续
     * @param $taid
     * @author wmc
     * @date 2019-11-06 17:28
     */
    public function getSwapBalanceById($taid)
    {
        try {
            $exInfo = $this->getSummaryAccount($this->regnumber, $taid);
            if(empty($exInfo))
                throw new \\Exception('账户不存在.');

            $balance = $this->getSwapBalance(self::ALL_SYMBOL, $exInfo);

            return $this->ret($balance);
        } catch (\\Exception $e) {
            return $this->err($e->getMessage());
        }
    }`,
                            },
                            {
                                title: '永续仓位',
                                func: 'getSwapPositionAllById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    }
                                ],
                                code: `/**
     * @desc  永续仓位 all
     * @param $taid
     * @author wmc
     * @date 2019-11-06 17:34
     */
    public function getSwapPositionAllById($taid)
    {
        try {
            $exInfo = $this->getSummaryAccount($this->regnumber, $taid);
            if(empty($exInfo))
                throw new \\Exception('账户不存在.');

            $position = $this->getPositionSwapAll($exInfo);

            return $this->ret($position);
        } catch (\\Exception $e) {
            return $this->err($e->getMessage());
        }
    }`,
                            },
                        ],
                    }
                ],

                cache: [
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '现货资产缓存',
                                func: 'getSpotCacheById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '杠杆资产缓存',
                                func: 'getMarginCacheById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    },
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '交割资产缓存',
                                func: 'getFutureCacheById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '交割头寸缓存',
                                func: 'getFuturePosCacheById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    },
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '永续资产缓存',
                                func: 'getSwapCacheById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '永续头寸缓存',
                                func: 'getSwapPosCacheById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    }
                ],

                mix: [
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '现货资产',
                                func: 'getSpotWithRecoupById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '杠杆资产',
                                func: 'getMarginWithRecoupById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    },
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '交割资产',
                                func: 'getFutureWithRecoupById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '交割仓位',
                                func: 'getFuturePosWithRecoupById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    },
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '永续资产',
                                func: 'getSwapWithRecoupById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '永续仓位',
                                func: 'getSwapPosWithRecoupById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    },
                ],
                collect: [
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '交割资产',
                                func: 'getFutureCollectById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '交割仓位',
                                func: 'getFuturePosCollectById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    },
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '永续资产',
                                func: 'getSwapCollectById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '永续仓位',
                                func: 'getSwapPosCollectById',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'taid',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'passive',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '纯被动'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    },
                ],

                balanceSummary: [
                    {
                        colSpan: 12,
                        config: [
                            {
                                title: '主动模式',
                                func: 'getBalanceSummary',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'id',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'input',
                                        field: 'filter',
                                        title: '过滤',
                                        value: 1,
                                        validate: [{required: true, message: '不能为空'}]
                                    },

                                    {
                                        type: 'select',
                                        field: 'is_rpc',
                                        title: '模式',
                                        value: 0,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '混合'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                            {
                                title: '混合模式',
                                func: 'getBalanceSummary',

                                rules: [
                                    {
                                        type: 'input',
                                        field: 'id',
                                        title: '账号Id',
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'input',
                                        field: 'filter',
                                        title: '过滤',
                                        value: 1,
                                        validate: [{required: true, message: '不能为空'}]
                                    },
                                    {
                                        type: 'select',
                                        field: 'is_rpc',
                                        title: '模式',
                                        value: 1,
                                        options: [
                                            {value: 0, label: '主动'},
                                            {value: 1, label: '混合'},
                                        ],
                                    },

                                ],
                                code: ``,
                            },
                        ]
                    },

                ],
                single: {
                    title: '独立接口测试',
                    rules: [
                        {
                            type: 'input',
                            field: 'taid',
                            title: '账号Id',
                            validate: [{required: true, message: '不能为空'}]
                        },
                        {
                            type: 'select',
                            field: 'passive',
                            title: '模式',
                            value: 0,
                            options: [
                                {value: 0, label: '主动'},
                                {value: 1, label: '纯被动'},
                            ],
                        },
                    ],
                    code: ``,
                },
            }
        },
        components: {
            AccountsTestUnit,
        },
        created() {
            //console.log('accounts create ................');
            let rules = {
                type: 'select',
                field: 'func',
                title: '',
                options: [],
                props: {
                    filterable: true,
                },
                validate: [{required: true, message: '不能为空'}]
            };

            this.restful.map((value) => {
                value.config.map((item) => {
                    rules.options.push({value: item.func, label: `${item.title}-${item.func}`});
                });
            });

            this.cache.map((value) => {
                value.config.map((item) => {
                    rules.options.push({value: item.func, label: `${item.title}-${item.func}`});
                });
            });

            this.mix.map((value) => {
                value.config.map((item) => {
                    rules.options.push({value: item.func, label: `${item.title}-${item.func}`});
                });
            });

            this.collect.map((value) => {
                value.config.map((item) => {
                    rules.options.push({value: item.func, label: `${item.title}-${item.func}`});
                });
            });

            this.single.rules.push(rules);
        },
        mounted() {
            console.log(process.env.NODE_ENV);
        },
        methods: {

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

.el-row {
    margin-bottom: 20px;

}
.el-col {
    border-radius: 4px;
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
    background: #d3dce6;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
