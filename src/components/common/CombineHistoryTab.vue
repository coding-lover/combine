
<template>
    <div style="margin-top: 10px;" class="history-box">
        <el-empty v-if="combineHisNum === 0" description="没有历史记录"></el-empty>
        <el-card v-if="combineHisNum > 0" class="box-card wrap-card">
            <div slot="header" class="clearfix">
                <el-button style="float: right;cursor: pointer;" type="danger" @click="$emit('del-all-his')">全部删除</el-button>
            </div>
            <div class="text item">
                <el-card class="box-card mt-10" v-for="(his, key) in combineHisList" :key="key" shadow="hover">
                    <div slot="header" class="clearfix cb-his-card-header">
                        <span>[{{ his.create_at }}]</span>
                        <span style="margin-left:10px;">{{ his.name }}</span>
                        <span style="margin-left:10px;">合并耗时：{{ his.spendTime }}</span>
                        <span style="margin-left:10px;">总耗时：{{ his.totalSpendTime }}</span>
                        <el-button style="float: right; padding: 3px 0; color:red;cursor: pointer;"
                            type="text" @click="$emit('del-his', key)">删除</el-button>
                    </div>
                    <div v-for="(child, cKey) in his.children" :key="cKey" class="text item">
                        <div v-if="child.name">
                            {{ child.name }}
                            <span style="color:#F56C6C;margin-left: 10px;">上传耗时： {{ child.time }}</span>
                        </div>
                        <div v-else>{{ child }}</div>
                    </div>
                </el-card>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'CombineHistoryTab',
    props: {
        combineHisNum: {
            type: Number,
            default: 0
        },
        combineHisList: {
            type: Array,
            default: () => []
        }
    }
};
</script>
