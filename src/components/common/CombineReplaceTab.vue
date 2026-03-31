
<template>
    <div class="wrap-padding">
        <el-row :gutter="10">
            <el-col :span="12" class="margin-bottom-10" v-for="(item, idx) in nodeList" :key="idx">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <el-col :span="5">
                            <el-input v-model="item.search" prefix-icon="el-icon-search" placeholder="查找"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <el-input v-model="item.replace" prefix-icon="el-icon-edit" placeholder="替换"></el-input>
                        </el-col>
                        <el-badge :value="item.fileNum" :hidden="item.fileNum <= 0">
                            <el-button v-show="!isReplaced(idx)" size="small" class="ml-3" type="primary" @click="onReplace(idx)">替换</el-button>
                            <el-button v-show="isReplaced(idx)" class="ml-3" size="small" type="success">已替换</el-button>
                        </el-badge>
                        <el-button size="small" type="primary" class="margin-left-3" @click="onDownload(idx)">下载</el-button>
                        <el-button size="small" type="danger" class="margin-left-3" @click="onClear(idx)">清空</el-button>
                        <el-button size="small" type="success" class="ml-3" @click="onShowHistory(idx)">替换历史</el-button>
                    </div>
                    <div class="content-overflow">
                        <el-upload 
                            class="sr-upload-demo" 
                            drag 
                            :ref="'upload' + idx" 
                            action=""
                            :on-remove="(file, fileList) => onRemove(idx, file, fileList)"
                            :on-change="(file, fileList) => onChange(idx, file, fileList)"
                            :auto-upload="false"
                            multiple
                        >
                            <i class="el-icon-upload" v-show="item.fileNum === 0"></i>
                            <div class="el-upload__text" v-show="item.fileNum === 0">将文件拖到此处，或<em>点击上传</em></div>

                            <div slot="file" slot-scope="{file}" v-show="item.fileNum > 0">
                                <a class="el-upload-list__item-name">
                                    <i class="el-icon-document"></i>{{ file.name }}
                                </a>
                                <label class="el-upload-list__item-status-label">
                                    <i class="el-icon-upload-success el-icon-circle-check"></i>
                                </label>
                                <i class="el-icon-close" style="width: 20px;" @click="onCloseFile(idx, file)"></i>
                            </div>
                        </el-upload>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="12" class="margin-bottom-10">
                <div class="my-avatar-uploader content-overflow" @click="$emit('add-node')">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </div>

                <el-row class="mt-10">
                    <el-badge :value="totalNum" class="large-btn" :hidden="totalNum <= 0">
                        <el-button type="danger" size="medium" class="large-btn" @click="$emit('batch-replace')">批量替换</el-button>
                    </el-badge>
                </el-row>

                <el-row class="mt-10">
                    <el-button type="primary" size="medium" class="large-btn" @click="$emit('batch-download')">批量下载</el-button>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'CombineReplaceTab',
    props: {
        nodeList: {
            type: Array,
            required: true
        },
        totalNum: {
            type: Number,
            default: 0
        }
    },
    methods: {
        isReplaced(idx) {
            const node = this.nodeList[idx];
            if (!node) return false;
            const replaceKey = `${node.search} = ${node.replace}`;
            return node.replaceHis.indexOf(replaceKey) !== -1;
        },
        onReplace(idx) {
            this.$emit('replace', idx);
        },
        onDownload(idx) {
            this.$emit('download', idx);
        },
        onClear(idx) {
            const ref = this.$refs['upload' + idx];
            if (ref && ref[0]) {
                ref[0].clearFiles();
            }
            this.$emit('clear', idx);
        },
        onShowHistory(idx) {
            this.$emit('show-history', idx);
        },
        onRemove(idx, file, fileList) {
            this.$emit('remove-file', { idx, file, fileList });
        },
        onChange(idx, file, fileList) {
            this.$emit('change-file', { idx, file, fileList });
        },
        onCloseFile(idx, file) {
            const ref = this.$refs['upload' + idx];
            if (ref && ref[0]) {
                ref[0].handleRemove(file, file.raw);
            }
        }
    }
};
</script>

<style scoped>
/* 样式保留在主组件中或根据需要移动 */
</style>
