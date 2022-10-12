<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-notice"></i> 账号测试</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
<el-collapse accordion>
    <el-collapse-item>
        <template slot="title">
            获取现货资产 /api/accounts/getSpotBalanceById?taid=%d <i class="header-icon el-icon-document"></i>
        </template>
        <my-prism  :plugins="plugins" :code="code" style="height: 300px;overflow-y: auto">//set 100x
$redis = Cache::factory(Cache::CACHE_TYPE_REDIS, "default");
for ($i = 0; $i < 100; $i++) {
    $redis->set("string-$i", mt_rand(1, 10000));
    $result[$i] = $redis->get("string-$i");
}

//get 100x
for ($i = 0; $i < 100; $i++) {
    $result[$i] = $redis->get("string-$i");
}</my-prism>
    </el-collapse-item>
</el-collapse>

            <el-form :inline="true"  class="demo-form-inline mt-5" :model="spotParams" :rules="rules" ref="spotForm">
                <el-form-item label="账号ID">
                    <el-input  placeholder="账号ID" v-model="spotParams.taid"></el-input>
                </el-form-item>
                <!--<el-form-item label="活动区域">
                    <el-select  placeholder="活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>-->
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>

            <el-collapse value="1" accordion>
                <el-collapse-item name="1">
                    <template slot="title" >
                        结果 <i class="header-icon el-icon-document"></i>
                    </template>
                    <json-viewer :value="spotResult" :expand-depth="5" boxed></json-viewer>
<!--
                    <my-prism  :plugins="plugins" style="height: 300px;overflow-y: auto" language="json" :code="spotResult"></my-prism>
-->
                </el-collapse-item>
            </el-collapse>

            </div>



</div>
</template>


<script>
    import MyPrism from "../common/MyPrism";
    import {getSpotBalanceById} from "../../api/accounts";
    export default {

        data () {
            return {
                code: '$redis = Cache::factory(Cache::CACHE_TYPE_REDIS, "default");\n' +
                    'for ($i = 0; $i < 100; $i++) {\n' +
                    '   $redis->set("string-$i", mt_rand(1, 10000));\n' +
                    '   $result[$i] = $redis->get("string-$i");\n' +
                    '}',
                plugins: ['line-numbers'],
                spotParams: {
                    taid: ''
                },
                rules: {
                    taid: [{ required: true, message: '请输账号ID', trigger: 'blur' }],
                },
                spotResult: '',
            }
        },
        components: {
            MyPrism
        },
        methods: {
            onSubmit() {
                this.$refs.spotForm.validate(valid => {
                    if (valid) {
                        getSpotBalanceById(this.spotParams).then(res => {
                            this.spotResult = res.payload;
                            console.log(res);
                            this.$notify({
                                title: '成功',
                                message: `#${this.spotParams.taid}  现货资产获取成功`,
                                type: 'success'
                            });
                        });
                        //this.$message.success('登录成功');
                        //localStorage.setItem('ms_username', this.param.username);
                        //this.$router.push('/');
                    } else {
                        this.$message.error('参数有误！');
                        return false;
                    }
                });

                console.log(this.spotParams);
            },
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
</style>
