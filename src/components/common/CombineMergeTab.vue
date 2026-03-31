
<template>
    <el-row style="margin-top: 10px;" class="third-box" :gutter="10" >
        <el-col :span="10">
            <el-card class="box-card" shadow="never">
                <span class="box-card-title">要串联的程式</span>

                <div class="content-overflow">
                    <el-upload v-show="!form.delivery" class="upload-demo" drag
                        :ref="'upload' + specialBoxKey" action=""
                        :on-remove="(file, fileList) => onRemove(specialBoxKey, file, fileList)" 
                        :on-change="(file, fileList) => onChange(specialBoxKey, file, fileList)"
                        :auto-upload="false"
                        :file-list="specialBoxFileList" multiple>
                        <i class="el-icon-upload" v-show="specialBoxFileList.length === 0"></i>
                        <div class="el-upload__text" v-show="specialBoxFileList.length === 0">将文件拖到此处，或<em>点击上传</em>
                        </div>
                        <div slot="file" slot-scope="{file}">
                            <a class="el-upload-list__item-name">
                                <i class="el-icon-document"></i>
                                <span class="upload-file-name-fmt">{{ file.name }} </span>
                                <span style="color:#F56C6C;margin-left: 10px;">上传耗时：{{ showSpendTime(file) }}</span>
                            </a>
                            <label class="el-upload-list__item-status-label">
                                <i class="el-icon-upload-success el-icon-circle-check"></i>
                            </label>
                            <i class="el-icon-close" style="width: 20px;"
                                @click="onCloseFile(specialBoxKey, file)"></i>
                        </div>
                    </el-upload>

                    <ul class="el-upload-list el-upload-list--text att" v-show="form.delivery">
                        <el-empty description="请在程式替换页面上传文件" v-show="fileList.length === 0">
                            <el-button type="primary" plain @click="$emit('switch-tab', 'first')">去上传</el-button>
                        </el-empty>

                        <li tabindex="0" class="el-upload-list__item is-ready" v-for="file in fileList" :key="file.id">
                            <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{ file.name }}</a>
                            <label class="el-upload-list__item-status-label">
                                <i class="el-icon-upload-success el-icon-circle-check"></i>
                            </label>

                            <el-tooltip class="item" effect="light" placement="right">
                                <div class="prism-editor-wrap" slot="content">
                                    <prism-editor class="my-editor" v-model="code" :highlight="highlighter"
                                        line-numbers readonly></prism-editor>
                                </div>
                                <i class="el-icon-close" style="width: 20px;"
                                    @click="$emit('delete-node-file', { nodeIdx: file.nodeIdx, fileId: file.id })"
                                    @mouseover="onMouseOver(file)"></i>
                            </el-tooltip>
                        </li>
                    </ul>

                </div>
                <div class="box-operator clearfix">
                    <el-col :span="12">
                        <el-badge :value="combineFileNum" class="large-btn"
                            :hidden="combineFileNum <= 0">
                            <el-button type="primary" v-show="form.ready" size="medium" class="large-btn"
                                @click="$emit('combine')">合并</el-button>
                            <el-button v-show="!form.ready" type="primary" size="medium" class="large-btn"
                                :loading="true">合并中</el-button>
                        </el-badge>
                    </el-col>
                    <el-col :span="12"><el-button type="danger" size="medium" class="large-btn"
                            @click="$emit('clear-box')">清空</el-button></el-col>
                </div>

            </el-card>
        </el-col>

        <el-col :span="14">
            <el-form ref="form" :rules="formRules" :model="form" label-width="150px" class="main-conf-form">
                <el-form-item label="使用替换">
                    <el-switch v-model="form.delivery"></el-switch>
                    <span style="color: #F56C6C;margin-left: 5px;display: inline-block;">使用已经替换的程式或者重新上传程式</span>
                </el-form-item>

                <el-form-item label="模板名" prop="templateName">
                    <el-input placeholder="模板名" class="margin-bottom-10" v-model="form.templateName"></el-input>
                </el-form-item>

                <el-form-item label="文件头删除行数" prop="fileHeaderDeletedLine">
                    <el-select v-model="form.fileHeaderDeletedLine" placeholder="请选择">
                        <el-option v-for="num in 20" :key="num" :label="num" :value="num"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="文件尾删除行数" prop="fileFooterDeletedLine">
                    <el-select v-model="form.fileFooterDeletedLine" placeholder="请选择">
                        <el-option v-for="num in 20" :key="num" :label="num" :value="num"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="文件头增加" prop="fileHeader" class="clearfix">
                    <el-input type="textarea" v-model="form.fileHeader" :autosize="{ minRows: 3 }"></el-input>
                </el-form-item>

                <el-form-item label="文件尾增加" prop="fileFooter" class="clearfix">
                    <el-input type="textarea" v-model="form.fileFooter" :autosize="{ minRows: 3 }"></el-input>
                </el-form-item>

                <el-form-item label="串联程式新名" prop="fileName">
                    <el-input placeholder="串联程式新名" v-model="form.fileName" class="input-with-select">
                        <el-select v-model="form.fileSuffix" slot="append" placeholder="请选择">
                            <el-option v-for="item in form.fileSuffixOptions" :key="item.value"
                                :label="item.name" :value="item.value"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>

                <el-form-item label="文件保存路径" prop="filePath">
                    <el-input placeholder="文件保存路径" v-model="form.filePath"
                                            class="input-with-select mt-10" readonly>
                                            <el-button slot="append" icon="el-icon-folder" type="success"
                                                @click="$emit('open-folder', -1)"></el-button>
                                        </el-input>
                </el-form-item>

                <el-form-item>
                   <el-button icon="el-icon-document" @click="$emit('show-template')">选择模板</el-button>
                        <el-button icon="el-icon-document-add" type="primary" plain
                            @click="$emit('save-template')">保存模板</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

export default {
    name: 'CombineMergeTab',
    components: {
        PrismEditor
    },
    props: {
        form: {
            type: Object,
            required: true
        },
        formRules: {
            type: Object,
            required: true
        },
        specialBoxFileList: {
            type: Array,
            default: () => []
        },
        specialBoxKey: {
            type: Number,
            required: true
        },
        fileList: {
            type: Array,
            default: () => []
        },
        combineFileNum: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            code: ""
        };
    },
    methods: {
        showSpendTime(file) {
            if (!file.hasOwnProperty('beginTime')) return '--秒';
            const finishTime = file.hasOwnProperty('finishTime') ? file.finishTime : Date.now();
            const differenceInSeconds = (finishTime - file.beginTime) / 1000;
            const minutes = Math.floor(differenceInSeconds / 60);
            const seconds = (differenceInSeconds % 60).toFixed(2);
            return `${minutes}分${seconds}秒`;
        },
        highlighter(code) {
            return highlight(code || '', languages.plaintext);
        },
        onRemove(idx, file, fileList) {
            this.$emit('remove-file', { idx, file, fileList });
        },
        onChange(idx, file, fileList) {
            this.$emit('change-file', { idx, file, fileList });
        },
        onCloseFile(idx, file) {
            const ref = this.$refs['upload' + idx];
            if (ref) {
                ref.handleRemove(file, file.raw);
            }
        },
        onMouseOver(file) {
            // this.code = file.content;
        }
    }
};
</script>
