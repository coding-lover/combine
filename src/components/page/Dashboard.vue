<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb5" style="height:252px;">
                    <div class="user-info">
                        <img src="../../assets/img/img_new.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>2020-11-01</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>广州</span>
                    </div>
                </el-card>
                <el-card shadow="hover" class="mgb5" style="" v-for="(stats, key) in serverStats">
                    <div slot="header" class="clearfix">
                        <span>{{stats.title}} Swoole服务详情</span>
                    </div>
                    <div v-if="stats.flag">
                        <el-form label-position="right" label-width="90px">
                                <el-col :span="12">
                                    <el-form-item label="启动时间">
                                        <span>{{stats.startTime}}</span>
                                    </el-form-item>

                                    <el-form-item label="php版本">
                                        <span>{{stats.phpVersion}}</span>
                                    </el-form-item>
                                    <el-form-item label="swoole版本">
                                        <span>{{stats.swooleVersion}}</span>
                                    </el-form-item>
                                    <el-form-item label="easy版本">
                                        <span class="success" type="success">{{stats.easyVersion}}</span>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="12">
                                    <el-form-item label="工作进程">
                                        <span>{{stats.workerNum}}</span>
                                    </el-form-item>
                                    <el-form-item label="空闲进程">
                                        <span>{{stats.idleWorkerNum}}</span>
                                    </el-form-item>
                                    <el-form-item label="协程数量">
                                        <span>{{stats.coroutineNum}}</span>
                                    </el-form-item>
                                    <el-form-item label="连接请求">
                                        <span>{{stats.connectNum}} - {{stats.requestNum}}</span>
                                    </el-form-item>

                                </el-col>
                        </el-form>
                    </div>
                    <div v-else>
                        <i class="el-icon-warning-outline warning-tag"> {{stats.title}} SWOOLE 服务不可用</i>
                    </div>
                </el-card>

            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20" v-if="0">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统消息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <img class="warning-img" src="../../assets/img/loading.png" alt="">
                        <span class="waiting-do">待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width:100%;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div v-if="scope.row.desc">
                                    <el-popover trigger="hover" placement="top">
                                        <p>{{scope.row.desc}}</p>
                                        <div slot="reference" class="name-wrapper">
                                            <div
                                                    class="todo-item"
                                                    :class="{'todo-item-del': scope.row.status}"
                                            >{{scope.row.title}}</div>
                                        </div>
                                    </el-popover>
                                </div>
                                <div v-else class="todo-item" :class="{'todo-item-del': scope.row.status}" >{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template>
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20" v-if="0">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import {getSwooleStats, getGoldSwooleStats, getAiSwooleStats} from '../../api/deploy';
import baseFunc from '../../utils/index';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            serverList: ['Zera', 'Gold', 'Ai'],
            serverStats: [

            ],
            todoList: [
                {
                    title: '金本位的杠杆算法要优化一下。0.4X应该是不会爆仓才对？',
                    status: false,
                    desc: '金本位的杠杆算法要优化一下。0.4X应该是不会爆仓才对',
                },
                {
                    title: '研究一下全仓杠杆的计算公式在双借时候的场景 2种币都不够的时候反而杠杆计算变低了',
                    status: false,
                    desc: '研究一下全仓杠杆的计算公式在双借时候的场景' +
                        ' 在双借，且2种币都不够的时候反而杠杆计算变低了 ' +
                        '我的想法是逐仓我们这样用是对的。因为2边肯定是对立关系。' +
                        '然后全仓的话我们要想想改一下 ' +
                        '因为可能我借了U和BTC。都不跌。然后我持仓的其他小币狂跌',
                },
                {
                    title: 'BINANCE 仓位头寸更新延时 （缓存时间过久）',
                    status: false
                },

                {
                    title: '仓位头寸出现新旧数据交替展示 （缓存时差问题）',
                    status: false
                },
                {
                    title: '今天要写100行代码加几个bug吧',
                    status: true
                }
            ],
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            options: {
                type: 'bar',
                title: {
                    text: '最近一周各品类销售图'
                },
                xRorate: 25,
                labels: ['周一', '周二', '周三', '周四', '周五'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 190, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [144, 198, 150, 235, 120]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '最近几个月各品类销售趋势图'
                },
                labels: ['6月', '7月', '8月', '9月', '10月'],
                datasets: [
                    {
                        label: '家电',
                        data: [234, 278, 270, 190, 230]
                    },
                    {
                        label: '百货',
                        data: [164, 178, 150, 135, 160]
                    },
                    {
                        label: '食品',
                        data: [74, 118, 200, 235, 90]
                    }
                ]
            },

        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    mounted() {
        this.loadServerStats();
        setInterval(this.loadServerStats, 1000 * 60);
    },
    // created() {
    //     this.handleListener();
    //     this.changeDate();
    // },
    // activated() {
    //     this.handleListener();
    // },
    // deactivated() {
    //     window.removeEventListener('resize', this.renderChart);
    //     bus.$off('collapse', this.handleBus);
    // },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        loadServerStats() {
            this.serverList.map((server, index) => {
                let stats = {
                    startTime: '',
                    workerNum: 0,
                    idleWorkerNum: 0,
                    coroutineNum: 0,
                    connectNum: 0,
                    requestNum: 0,
                    phpVersion: '',
                    swooleVersion: '',
                    easyVersion: '111',
                    title: server,
                    flag: true,
                };

                let response;
                switch (server) {
                    case 'Gold':
                        response = getGoldSwooleStats({});
                        break;
                    case 'Ai':
                        response = getAiSwooleStats({});
                        break;
                    case 'Zera':
                    default:
                        response = getSwooleStats({});
                        break;
                }

                response.then(res => {
                    console.log(res)
                    //this.serverStats[index] = {};
                    if(!res.payload.data || res.payload.data.length <= 0)
                    {
                        this.serverStats[index].flag = false;
                        return false;
                    }
                    let data = res.payload.data;
                    
                    stats.flag = true;
                    stats.startTime = baseFunc.fTime(data.server_stats.start_time);
                    stats.workerNum = data.server_stats.worker_num;
                    stats.idleWorkerNum = data.server_stats.idle_worker_num;
                    stats.coroutineNum = data.server_stats.coroutine_num;
                    stats.connectNum = data.server_stats.connection_num;
                    stats.requestNum = data.server_stats.request_count;

                    stats.phpVersion = data.easy_stats.php_version;
                    stats.swooleVersion = data.easy_stats.swoole_version;
                    stats.easyVersion = data.easy_stats.easy_swoole_version;

                    this.$set(this.serverStats, index, stats);
                }).catch((error) => {
                    //console.log(error)
                    stats.flag = false;
                    this.$set(this.serverStats, index, stats);
                });
            });

        },
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.warning-img {
    position: absolute;
    top: -1px;
}
.waiting-do {
    padding-left: 50px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.mgb5 {
    margin-bottom: 5px;
}



.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
.warning-tag {
    font-size: 30px;
    color: red;
}
</style>
