<template>

    <div class="container">
        <div class="block">
            <el-timeline>
                <el-timeline-item placement="top"
                        v-for="(activity, index) in activities"
                        :key="index"
                        :icon="activity.icon"
                        :type="activity.type"
                        :color="activity.color"
                        :size="activity.size"
                        :timestamp="activity.timestamp">
                    <el-card>
                        <el-table
                                :data="activity.table"
                                :row-class-name="tableRowClassName"
                                style="width: 100%">
                            <el-table-column
                                    prop="breed"
                                    label="品种"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="oid"
                                    label="oid"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    prop="size"
                                    label="数量">
                            </el-table-column>
                            <el-table-column
                                    prop="side"
                                    label="方向">
                            </el-table-column>

                            <el-table-column
                                    prop="price"
                                    label="均价">
                            </el-table-column>
                            <el-table-column
                                    prop="equity"
                                    label="权益">
                            </el-table-column>


                        </el-table>
                        <div v-html="activity.content"></div>
                    </el-card>
                </el-timeline-item>
            </el-timeline>

        </div>
    </div>

</template>


<script>
    import {sprintf} from "../../utils/index";
    import {getOrderList} from "../../api/accounts";
    export default {
        data() {
            return {
                tableData: [],
                activities: [
                   /* {
                    content: '支持使用图标',
                    timestamp: '2018-04-12 20:46',
                    size: 'large',
                    type: 'primary',
                    icon: 'el-icon-more'
                }, {
                    content: '支持自定义颜色',
                    size: 'large',
                    type: 'success',
                    timestamp: '2018-04-03 20:46',
                    color: '#0bbd87'
                }, {
                    content: '支持自定义尺寸',
                    timestamp: '2018-04-03 20:46',
                    size: 'large'
                }, {
                    content: '默认样式的节点',
                    timestamp: '2018-04-03 20:46'
                }*/
                ]
            };
        },
        mounted() {
            //console.log(this.sprintf("%d + %s", 1,  'xxxx'))
            this.renderOrderList();
        },
        methods: {
            tableRowClassName({row, rowIndex}) {
                if (row.coid != '') {
                    return 'warning-row';
                }

                return '';
            },
            renderOrderList() {
                getOrderList().then(res => {
                    console.log(res);
                    res.payload.data.map(item => {
                        //console.log(item)
                        let multi = 0;
                        let message = {
                            content: '',
                            timestamp: '',
                            size: 'large',
                            table: [],
                            //type: 'primary',
                            //color: '#0bbd87',
                            //icon: 'el-icon-more'
                        };
                        if(item.spot.length > 0) {
                            multi++;
                            //message.content += "<h4>spot</h4>";
                            item.spot.map((value, key) => {
                                message.table.push({
                                    breed: 'spot',
                                    oid: value.oid,
                                    coid: value.coid,
                                    size: value.size,
                                    side: value.side,
                                    price: value.price + '/' + value.avg_price,
                                    equity: 0,
                                });
                                message.timestamp = value.date;
                                //message.content += this.sprintf("oid=%s, size=%s, price=%s, side=%s<br \>", value.oid, value.size, value.price, value.side);
                            });
                            message.content += "<br />";
                        }

                        if(item.swap.length > 0) {
                            multi++;
                            //message.content += "<h4>swap</h4>";
                            item.swap.map((value, key) => {
                                message.table.push({
                                    breed: 'swap',
                                    oid: value.oid,
                                    coid: value.coid,
                                    size: value.size,
                                    side: value.side,
                                    price: 0,
                                    equity: value.profit + ' / ' + value.equity,
                                });

                                message.timestamp = value.date;
                                //message.content += this.sprintf("oid=%s, size=%s, profit=%s/%s, side=%s<br \>", value.oid, value.size, value.profit, value.equity, value.side);
                            });
                        }

                        if(multi == 2) {
                            message.icon = 'el-icon-more';
                            message.color = '#0bbd87';
                        }

                        this.activities.push(message)
                    });

                });
            }
        },
    };
</script>

<style scoped>
.block {
    margin-left: 30px;
}

.el-table .warning-row {
    background: oldlace;
}

.el-table .success-row {
    background: #f0f9eb;
}
</style>
