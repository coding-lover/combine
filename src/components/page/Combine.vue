<template>
    <el-row :gutter="10">
        <el-col :span="24" :offset="0" class="wrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">

                <el-tab-pane  name="first" class="wrap-padding">
                    <span slot="label">程式替换<el-badge :value="totalNum" class="large-btn" :hidden="totalNum > 0 ? false : true" ></el-badge></span>

                    <el-col :span="12" class="margin-bottom-10" v-for="(item, idx) in nodeList">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <el-col :span="5">
                                    <el-input v-model="item.search" prefix-icon="el-icon-search" placeholder="查找"></el-input>
                                </el-col>
                                <el-col :span="5">
                                    <el-input v-model="item.replace" prefix-icon="el-icon-edit" placeholder="替换"></el-input>
                                </el-col>
                                <el-badge :value="item.fileNum" class="" :hidden="item.fileNum > 0 ? false : true">
                                    <el-button v-show="!replaceFlag(idx)" size="small" class="ml-3" type="primary"
                                               @click="doReplace(idx)">替换
                                    </el-button>
                                    <el-button v-show="replaceFlag(idx)" class="ml-3" size="small" type="success">已替换</el-button>
                                </el-badge>
                                <el-button size="small" type="primary" class="margin-left-3" @click="downloadFile(idx)">下载</el-button>
                                <el-button size="small" type="danger" class="margin-left-3" @click="clearSearchReplace(idx)">清空</el-button>
                                <el-button size="small" type="success" class="ml-3" @click="getReplaceHis(idx)">替换历史</el-button>

                            </div>
                            <div class="content-overflow">
                                <el-upload
                                        class="sr-upload-demo"
                                        drag
                                        :ref="createUploadKey(idx)"
                                        action=""
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove(idx)"
                                        :on-progress="handleProgress"
                                        :on-change="myHandleChange(idx)"
                                        :auto-upload="false"
                                        multiple>
                                    <i class="el-icon-upload" v-show="item.fileNum == 0"></i>
                                    <div class="el-upload__text" v-show="item.fileNum == 0">将文件拖到此处，或<em>点击上传</em></div>
                                </el-upload>
                            </div>

                        </el-card>
                    </el-col>

                    <el-col :span="12" class="margin-bottom-10">
                        <div class="my-avatar-uploader content-overflow" @click="addNode">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </div>

                        <el-row class="mt-10">
                            <el-badge :value="totalNum" class="large-btn" :hidden="totalNum > 0 ? false : true" >
                                <el-button type="danger" size="medium" class="large-btn" @click="batchReplace">批量替换</el-button>
                            </el-badge>
                        </el-row>

                        <el-row class="mt-10">
                            <el-button type="primary" size="medium" class="large-btn" @click="batchDownload">批量下载</el-button>
                        </el-row>

                    </el-col>


                </el-tab-pane>


                <!--<el-tab-pane label="文件合并" name="second" v-show="false">
                    <el-col :span="10">
                        <el-form ref="form" :rules="formRules" :model="form" label-width="90px">
                            <el-form-item label="使用替换">
                                <el-switch v-model="form.delivery">
                                </el-switch>
                                <span style="color: #F56C6C;margin-left: 5px;display: inline-block;">使用已经替换的文件或者重新上传文件</span>
                            </el-form-item>
                            <el-form-item label="上传" v-show="!form.delivery">
                                <span slot="label">上传<el-badge :value="specialNum" :hidden="specialNum > 0 ? false : true" ></el-badge></span>
                                <el-upload
                                        class=""
                                        drag
                                        action=""
                                        :ref="createUploadKey(specialKey)"
                                        :on-change="myHandleChange(specialKey)"
                                        :on-remove="handleRemove(specialKey)"
                                        :auto-upload="false"
                                        multiple>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">

                                        <p>将文件拖到此处，或<em>点击上传</em></p>
                                    </div>
                                </el-upload>
                            </el-form-item>

                            <el-form-item label="文件头" prop="fileHeader">
                                <el-input type="textarea" v-model="form.fileHeader"></el-input>
                            </el-form-item>


                            <el-form-item label="文件尾" prop="fileFooter">
                                <el-input type="textarea" v-model="form.fileFooter"></el-input>
                            </el-form-item>

                            <el-form-item label="文件名" prop="fileName">
                                <el-input placeholder="请输入内容" v-model="form.fileName" class="input-with-select">
                                    <el-select v-model="form.fileSuffix" slot="append" placeholder="请选择" prop="fileSuffix">
                                        <el-option
                                                v-for="item in form.fileSuffixOptions"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-input>

                            </el-form-item>

                            <el-form-item>
                                <el-button v-show="form.ready" type="primary" @click="combineFile">立即合并</el-button>
                                <el-button v-show="!form.ready" type="primary" :loading="true">合并中</el-button>
                                <el-button @click="formReset()">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="14">

                        <div class="drag-box">
                            <div class="drag-box-item">
                                <el-empty v-show="getFileList.length == 0" description="未上传文件"></el-empty>
                                <el-table-draggable handle=".allowDrag" @drop="dragChange">
                                    <el-table
                                            ref="dragTable"
                                            :data="getFileList"
                                            style="width: 100%" v-show="getFileList.length > 0">
                                        <el-table-column
                                                prop="id"
                                                label="拖拽"
                                                width="50">
                                            <template slot-scope="{row}">
                                                <i class="el-icon-rank allowDrag" style="cursor:pointer" /> {{row.id}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                prop="name"
                                                label="文件名"
                                                width="230" >
                                            <template slot-scope="scope">
                                                <span class="overflow-text">{{scope.row.name}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                                prop="option"
                                                label="操作">
                                            <template slot="header" slot-scope="scope">
                                                <el-select class="" v-model="dragConfig.optionVal" placeholder="请选择" size="mini">
                                                    <el-option
                                                            v-for="item in dragConfig.options"
                                                            :key="item.value"
                                                            :label="item.label"
                                                            :value="item.value">
                                                    </el-option>
                                                </el-select>

                                                <el-input-number class=" ml-3" size="mini" v-model="dragConfig.setVal" controls-position="right"  :min="0" :max="10" placeholder="值"></el-input-number>

                                                <el-button type="primary" size="mini" class="ml-3" @click="fileConfigAdd">加</el-button>
                                                <el-button type="primary" size="mini" @click="fileConfigReduce">减</el-button>
                                            </template>
                                            <template slot-scope="scope">
                                                <el-input-number :controls="false" :ref="createDeleteKey(scope.row.id, 'headerDeleteLine')" size="mini" v-model="scope.row.headerDeleteLine" controls-position="right"  :min="0"  placeholder="文件头删除行数"></el-input-number>
                                                <el-input-number :controls="false" :ref="createDeleteKey(scope.row.id, 'footerDeleteLine')" class="ml-3" size="mini" v-model="scope.row.footerDeleteLine" controls-position="right" :min="0" placeholder="文件尾删除行数"></el-input-number>
                                            </template>

                                        </el-table-column>

                                    </el-table>
                                </el-table-draggable>
                            </div>
                        </div>

                    </el-col>

                </el-tab-pane>-->

                <el-tab-pane label="程式串联" name="third" style="margin-top: 10px;" class="third-box">
                    <el-col :span="10">
                        <el-card class="box-card" shadow="never" >
                            <span class="box-card-title">要串联的程式</span>

                            <div class="content-overflow">
                                <el-upload v-show="!form.delivery"
                                        class="upload-demo"
                                        drag
                                        :ref="createUploadKey(specialBoxKey)"
                                        action=""
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove(specialBoxKey)"
                                        :on-progress="handleProgress"
                                        :on-change="myHandleChange(specialBoxKey)"
                                        :auto-upload="false"
                                        :disabled="false"
                                        multiple>
                                    <i class="el-icon-upload" v-show="specialBoxFileList.length == 0"></i>
                                    <div class="el-upload__text" v-show="specialBoxFileList == 0">将文件拖到此处，或<em>点击上传</em></div>
                                </el-upload>

                                <ul class="el-upload-list el-upload-list--text" v-show="form.delivery">
                                    <el-empty description="请在程式替换页面上传文件" v-show="getFileList.length == 0">
                                        <el-button type="primary" plain @click="activeName='first'">去上传</el-button>
                                    </el-empty>

                                    <li tabindex="0" class="el-upload-list__item is-ready" v-for="file in getFileList">
                                        <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.name}}</a>
                                        <label class="el-upload-list__item-status-label">
                                            <i class="el-icon-upload-success el-icon-circle-check"></i>
                                        </label>
                                        <i class="el-icon-close" @click="deleteNodeListFile(file.nodeIdx, file.id)"></i>
                                        <i class="el-icon-close-tip">按 delete 键可删除</i>
                                    </li>
                                </ul>

                            </div>
                            <div class="box-operator clearfix">
                                <el-col :span="12">
                                    <el-badge :value="getCombineFileNum" class="large-btn" :hidden="getCombineFileNum > 0 ? false : true" >
                                        <el-button type="primary" v-show="form.ready" size="medium" class="large-btn" @click="combineFile">合并</el-button>
                                        <el-button v-show="!form.ready" type="primary"  size="medium" class="large-btn" :loading="true">合并中</el-button>
                                    </el-badge>
                                </el-col>
                                <el-col :span="12"><el-button type="danger" size="medium" class="large-btn" @click="clearBoxFileList">清空</el-button></el-col>
                            </div>

                        </el-card>
                    </el-col>

                    <el-col :span="14">
                        <el-form ref="form" :rules="formRules" :model="form" label-width="150px">
                            <el-form-item label="使用替换">
                                <el-switch v-model="form.delivery">
                                </el-switch>
                                <span style="color: #F56C6C;margin-left: 5px;display: inline-block;">使用已经替换的程式或者重新上传程式</span>
                            </el-form-item>

                            <el-form-item label="文件头删除行数" prop="fileHeaderDeletedLine">
                                <el-select v-model="form.fileHeaderDeletedLine"  placeholder="请选择" >
                                    <el-option
                                            v-for="num in 20"
                                            :key="num"
                                            :label="num"
                                            :value="num">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="文件尾删除行数" prop="fileFooterDeletedLine">
                                <el-select v-model="form.fileFooterDeletedLine"  placeholder="请选择" >
                                    <el-option
                                            v-for="num in 20"
                                            :key="num"
                                            :label="num"
                                            :value="num">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="文件头增加" prop="fileHeader">
                                <el-input type="textarea" v-model="form.fileHeader"></el-input>
                            </el-form-item>


                            <el-form-item label="文件尾增加" prop="fileFooter" class="clearfix">
                                <el-col :span="14">
                                    <el-input type="textarea" v-model="form.fileFooter" :autosize="{ minRows: 6}"></el-input>
                                </el-col>

                                <el-col :span="10">
                                    <el-input placeholder="模板名" class="margin-bottom-10" v-model="form.templateName"></el-input>

                                    <el-button icon="el-icon-document" @click="showTemplate">选择模板</el-button>
                                    <el-button icon="el-icon-document-add" type="primary" plain @click="saveTemplate">保存模板</el-button>
                                </el-col>
                            </el-form-item>

                            <el-form-item label="串联程式新名" prop="fileName">
                                <el-input placeholder="串联程式新名" v-model="form.fileName" class="input-with-select">
                                    <el-select v-model="form.fileSuffix" slot="append" placeholder="请选择" prop="fileSuffix">
                                        <el-option
                                                v-for="item in form.fileSuffixOptions"
                                                :key="item.value"
                                                :label="item.name"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-input>

                            </el-form-item>

                            <el-form-item label="文件保存路径" prop="filePath">
                                <el-input placeholder="文件保存路径" v-model="form.filePath" class="input-with-select" readonly>
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <!--<el-button v-show="form.ready" type="primary" @click="combineFile">立即合并</el-button>
                                <el-button v-show="!form.ready" type="primary" :loading="true">合并中</el-button>
                                <el-button @click="formReset()">取消</el-button>-->
                            </el-form-item>
                        </el-form>

                    </el-col>

                    <el-dialog title="选择文件尾模板" :visible.sync="dialogFormVisible">
                        <el-form >
                            <div v-for="(item,key) in getTemplate">
                                <el-form-item label="" prop="fileName">
                                    <el-col :span="23">
                                        <el-radio v-model="form.selectedTemplate" :label="key" border class="s-radio clearfix">
                                            <el-col :span="13" :offset="1">
                                                <el-input placeholder="文件尾增加内容" v-model="item.value" type="textarea" :autosize="{ minRows: 6}">

                                                </el-input>
                                            </el-col>

                                            <el-col :span="10" >
                                                <el-input   placeholder="模板名称" v-model="item.name" class="s-input"></el-input>

                                                <div>
                                                    <el-input placeholder="文件保存路径" v-model="item.path" class="input-with-select mt-10" readonly >
                                                        <el-button slot="append" icon="el-icon-folder" type="success" @click="openFolder(key)"></el-button>
                                                    </el-input>
                                                </div>
                                            </el-col>
                                        </el-radio>
                                    </el-col>

                                    <el-col :span="1"  title="删除" >
                                        <i class="el-icon-close t-close" @click="deleteTemplate(key)"></i>
                                    </el-col>

                                </el-form-item>
                            </div>

                        </el-form>

                        <div slot="footer" class="dialog-footer">
                            <el-button  @click="addTemplate">增 加</el-button>
                            <el-button type="primary" @click="dialogSaveTemplate">保 存</el-button>
                        </div>
                    </el-dialog>

<!--                    选择文件夹-->
                    <el-dialog title="选择保存的目录" :visible.sync="dialogFolderSelectVisible">
                        <div>
                            <span class="folder-select-title">当前选中: </span>
                            <span v-show="getCurFolder.length == 0" style="color:red;">未选中文件夹</span>
                            <span v-show="getCurFolder.length > 0">{{getCurFolder}}</span>
                        </div>
                        <div class="folder-content">
                            <v-folder :data="folderData"  :ajax="ajax" :conf="folderConfig" @change="folderChange"></v-folder>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="dialogSaveFolder">保 存</el-button>
                        </div>
                    </el-dialog>

                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
    import ElTableDraggable from 'element-ui-el-table-draggable';
    const iconv = require('iconv-lite');
    const jschardet = require("jschardet")
    import { invoke, window } from '@tauri-apps/api';



    export default {
        data() {
            return {
                activeName: 'first',
                winTop: '',
                cacheFile: 'web.conf.json',
                isWinOs: false,
                folderData: {
                    // root
                    sourceDir: '/',
                    // children
                    files: [],
                    dirs: []
                },
                folderData2: {
                    sourceDir: 'root',
                    dirs: [{
                        sourceDir: 'subroot-1',
                        dirs: ['empty 1', 'empty 2', 'empty 3'],
                        files: ['file1234', 'file5678', 'filexyzw']
                    }, {
                        sourceDir: 'subroot-2',
                        dirs: ['empty 1', 'empty 2', 'empty 3'],
                        files: ['file1234', 'file5678', 'filexyzw']
                    }, {
                        sourceDir: 'subroot-3',
                        dirs: ['empty 1', 'empty 2', 'empty 3'],
                        files: ['file1234', 'file5678', 'filexyzw']
                    }],
                    files: ['a.js', 'b.js', 'c.js']
                },

                folderConfig: {
                    // tree node name
                    node: 'sourceDir',
                    // KEY NAME of dirs/branches/parents etc.. .
                    branch: 'dirs',
                    // KEY NAME of  files/leafs/children etc...
                    leaf: 'files'
                },
                ajax: (node) => {

                    return this.readFolder(node);

                    console.log(node)
                    return {
                        sourceDir: 'subroot-99',
                        dirs: ["xxx", 'empty 2', 'empty 3'], ///仅支持当前层
                        files: ['file1234', 'file5678', 'filexyzw']
                    }
                },

                operatorTemplateIdx: 0,

                dialogFolderSelectVisible: false,
                dialogFormVisible: false,
                selectedFolder: [],
                fileList: [],
                tmpFileNames: [],
                nodeList: [],
                nodeNum: 2,
                replaceHis: [],
                specialFileList: [],
                specialBoxFileList: [
                ],
                specialKey: 99,
                specialBoxKey: 98,
                form: {
                    fileHeader: '',
                    fileFooter: '',
                    fileName: '',
                    filePath: '',
                    fileHeaderDeletedLine: 1,
                    fileFooterDeletedLine: 1,
                    fileSuffix: ".nc",
                    fileSuffixOptions: [
                        {value: ".nc", name: ".nc"},
                        {value: ".pim", name: ".pim"},
                    ],
                    templateList: [],
                    selectedTemplate: 0,
                    templateName: '',
                    ready: true,
                    delivery: true,
                },
                dragOptions:{
                    animation: 120,
                    scroll: true,
                    group: 'sortlist',
                    ghostClass: 'ghost-style'
                },
                curId: 0,
                combineFileList : [
                ],

                dragList: [],
                dragConfig: {
                    optionVal: 0,
                    options: [
                        {value: 0, label: "文件头删除行数"},
                        {value: 1, label: "文件尾删除行数"}
                    ],

                    setVal: 1,
                },

                formRules: {
                    fileHeader: [
                        { required: true, message: '请输入文件头', trigger: 'blur' },
                    ],
                    fileFooter: [
                        { required: true, message: '请输入文件尾', trigger: 'change' }
                    ],
                    fileName: [
                        { required: true, message: '请输入完整文件名', trigger: 'change', validator: (rule, value, callback) => {
                            if(!this.form.fileName) {
                                return callback(new Error('请输入完整文件名'));
                            }

                            if(this.form.fileSuffix === '') {
                                return callback(new Error('请选择文件后缀'));
                            }

                            callback();
                        }}
                    ],
                    fileSuffix: [
                        { required: true, message: '请选择文件后缀', trigger: 'change' }
                    ],
                    filePath: [
                        { required: true, message: '请在模板里面设置文件路径', trigger: 'blur' }
                    ],

                }
            };
        },
        components:{
            ElTableDraggable
        },
        computed: {
            getCombineFileNum: function() {
                if(this.form.delivery) {
                    return this.totalNum;
                }

                return this.specialBoxNum;
            },
            getCurFolder: function() {
                return this.selectedFolder.join(',');
            },
            replaceFlag: function () {
                return (idx) => {
                    if (!this.nodeList.hasOwnProperty(idx)) {
                        return false;
                    }

                    let node = this.nodeList[idx];
                    let replaceKey = this.createReplaceKey(node.search, node.replace);
                    return node.replaceHis.indexOf(replaceKey) != -1;
                };
            },
            totalNum: function() {
                let num = 0;
                this.nodeList.map(node => {
                    num += node.fileList.length;
                });

                return num;
            },
            specialNum: function() {
                return this.specialFileList.length;
            },
            specialBoxNum: function() {
                return this.specialBoxFileList.length;
            },

            getTemplate: function() {
                return this.form.templateList;
            },

            getFileList: {
                get() {
                    let fileList = [];

                    if(this.form.delivery) {
                        this.nodeList.map((node, nodeIdx) => {
                            node.fileList.map((file, fileIdx) => {
                                file.nodeIdx = nodeIdx;
                                file.fileIdx = fileIdx;
                                fileList.push(file);
                            });
                        });
                    } else {
                        //debugger
                        //fileList.push(...this.specialFileList);
                    }

                    return fileList;
                },
                set(value) {
                    console.warn(value)
                },
            },
            getFileBadge: function() {
                return (rawName) => {
                    return rawName + (this.totalNum > 0 ? '<el-badge value="' + this.totalNum + '" class="large-btn"  />' : '');
                };
            },
        },

        watch: {
            //nodeList: {
            // immediate: true,
            // //deep: true,
            // handler(nodeList) {
            //
            // }
            //},
            "form.selectedTemplate": {
                immediate: false,
                handler(value) {
                    this.selectTemplate(value);
                },
            }
        },
        created() {
            //this.initParams();
        },
        mounted() {
            this.initNodeList();
            this.initParams();
            this.handleWindowTop();

            if(navigator.userAgent.toLowerCase().indexOf('windows') != -1) {
                this.isWinOs = true;
                this.folderData.dirs = ['C:/', 'D:/', 'E:/', 'F:/'];
            }
        },

        methods: {
             handleWindowTop() {
                let curWin = window.getCurrent();
                if (this.winTop === '窗口置顶') {
                    curWin.setAlwaysOnTop(true);
                    this.winTop = '取消置顶';
                } else {
                    curWin.setAlwaysOnTop(false);
                    this.winTop = '窗口置顶';
                }
            },
            deleteNodeListFile(nodeIdx, fileId) {
                let fileList = this.nodeList[nodeIdx].fileList.slice(0);
                fileList.map(file => {
                    if(file.id == fileId) {
                        this.closeUploadedFile(nodeIdx, file, true)
                    }
                });
            },
            dialogSaveFolder() {
                this.dialogFolderSelectVisible = false;
                this.form.templateList[this.operatorTemplateIdx]['path'] = this.selectedFolder.join(',');
                this.updateLocalStorage();
            },
            openFolder(idx) {
                this.dialogFolderSelectVisible = true;
                this.operatorTemplateIdx = idx;
            },
            basename(str) {
                var idx = str.lastIndexOf('/')
                idx = idx > -1 ? idx : str.lastIndexOf('\\')
                if (idx < 0) {
                    return str
                }
                return str.substring(idx + 1);
            },

            readFolder(node) {
                return this.wmcReadDir(node.path).then(res => {
                    let realPath = {
                        sourceDir: this.basename(node.path),
                        dirs: [], ///仅支持当前层
                        files: []
                    };
                    res.map(item => {
                        if(item.is_dir) {
                            realPath.dirs.push(this.basename(item.path));
                        }
                    });

                    return realPath;
                });
            },

            writeContent(path, content) {
                return this.wmcReadDir(node.path).then(res => {
                    let realPath = {
                        sourceDir: this.basename(node.path),
                        dirs: [], ///仅支持当前层
                        files: []
                    };
                    res.map(item => {
                        if(item.is_dir) {
                            realPath.dirs.push(this.basename(item.path));
                        }
                    });

                    return realPath;
                });
            },

            folderChange(value) {
                console.warn(value)
                if(this.isWinOs) {
                    value = value.map(res => {
                        return res.slice(1);
                    });
                }

                this.selectedFolder = value;
            },

            wmcReadDir(path) {
                return invoke('wmc_read_dir', { path: path }).then(res => {
                    console.log(res)

                    let content = JSON.parse(res)
                    if(!content || content.length == 0) {
                        return [];
                    }

                    console.warn(content)
                    content = content.map(item => {
                        let parsed = item.split(',');
                        return {
                            path: this.fixWinsDir(parsed[0]),
                            is_dir: parsed[1] == 'true' ? true : false,
                        };
                    });

                    return content;
                });
            },

            fixWinsDir(dir) {
                if(!this.isWinOs) {
                    return dir;
                }

                dir = dir.replace(new RegExp("//", "g"), '/');
                dir = dir.replace(new RegExp("\\\\", "g"), '/');

                return dir;
            },

            wmcWrite(path, content) {
                return invoke('wmc_write', { path: path , content: content}).then(res => {
                    console.log('wmc_write: ' + res)

                    return JSON.parse(res);
                });
            },

            //保存到本地文件
            cacheRead() {
                return this.wmcRead(this.cacheFile);
            },

            cacheWrite(json) {
                this.cacheRead().then(res => {
                    res = typeof res == 'object' ? res : {};
                    res = Object.assign({}, res, json);
                    this.wmcWrite(this.cacheFile, JSON.stringify(res))
                })
            },

            wmcRead(path) {
                return invoke('wmc_read', { path: path}).then(res => {
                    console.log('wmc_read: ' + res)

                    return res;
                });
            },

            triggerFile(event) {
                console.log(event.target.files)
            },
            deleteTemplate(idx)  {

                this.form.templateList = this.form.templateList.filter((t,key) => {return key != idx;});
                console.log(this.form.templateList.length)
                console.log(this.form.templateList)
                if(this.form.templateList == null) {
                    this.form.templateList = [];
                }
            },
            initParams() {
                let formCache = localStorage.getItem('form');
                formCache = JSON.parse(formCache);
                if(!formCache) {
                    return "";
                }

                if(formCache != null) {
                    for(let key in formCache) {
                        this.form[key] = formCache[key];
                    }
                }

                return false;
                this.cacheRead().then(res => {
                    if(!res) {
                        return "";
                    }

                    let formCache = JSON.parse(res);
                    console.log(formCache)
                    if(formCache != null) {
                        for(let key in formCache) {
                            this.form[key] = formCache[key];
                        }
                    }
                });
            },
            dialogSaveTemplate() {
                this.dialogFormVisible = false;
                this.selectTemplate(this.form.selectedTemplate);
                this.updateLocalStorage();
            },
            updateLocalStorage() {
                localStorage.setItem('form', JSON.stringify(this.form));
                //this.cacheWrite(this.form)
            },
            selectTemplate(idx) {
                this.form.templateList = this.form.templateList.filter(t => t); // remove null
                if(!this.form.templateList.hasOwnProperty(idx)) {
                    return false;
                }

                let cur = this.form.templateList[idx];
                this.form.fileFooter = cur.value;
                this.form.templateName = cur.name;
                this.form.filePath = cur.path;
            },

            addTemplate() {
                let template = {name: '', value: '', path: ''};
                this.form.templateList.push(template);
            },

            showTemplate() {
                this.dialogFormVisible = true;
            },

            saveTemplate() {
                let template = {
                    value: this.form.fileFooter,
                    name: this.form.templateName,
                };

                if(!template.value) {
                    this.$message.info('请输入文件尾内容');
                    return false;
                }

                if(!template.name) {
                    this.$message.info('请输要保存模板名称');
                    return false;
                }

                for(let idx in this.form.templateList)  {
                    if(this.form.templateList[idx].name == template.name) {
                        this.form.templateList[idx].value = template.value;
                        this.$message.success('模板保存成功');
                        this.updateLocalStorage();
                        return  false;
                    }
                }

                this.form.templateList.push(template);
                this.updateLocalStorage();
            },

            combineFile() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }

                    let rawList = [];
                    let rawIds = [];

                    if(this.form.delivery) {
                        this.nodeList.map(node => {
                            node.fileList.map(file => {
                                rawIds.push(file.id);
                                rawList.push(file);
                            });
                        });
                    } else {
                        rawList.push(...this.specialFileList);
                        rawList.push(...this.specialBoxFileList);
                    }

                    if(rawList.length == 0) {
                        this.$message.info('请上传要合并的文件');
                        return false;
                    }

                    let promiseList = [];
                    rawList.map(file => {
                        //debugger
                        /*if(this.form.delivery && rawIds.indexOf(file.id) == -1) {
                            return false;
                        }

                        if(!this.form.delivery && rawIds.indexOf(file.id) != -1) {
                            return false;
                        }*/

                        let p = this.readFile(file, res => {
                            //debugger
                            console.warn('***********res***********')
                            console.warn(res)
                            res = res.split("\n").filter(res => res);
                            res.splice(0, this.form.fileHeaderDeletedLine);
                            res.splice(res.length - this.form.fileFooterDeletedLine, this.form.fileFooterDeletedLine);
                            return res.join("\n");
                        });

                        promiseList.push(p);
                    });

                    if(promiseList.length == 0) {
                        this.$message.info('请上传要合并的文件11');
                        return false;
                    }

                    this.form.ready = false;
                    Promise.all([...promiseList]).then(res => {
                        console.log(res)
                        res.unshift(this.fixTextArea(this.form.fileHeader));
                        res.push(this.fixTextArea(this.form.fileFooter));
                        res = res.filter(res => res);
                        console.log("raw res: ", res)
                        res = res.join("\n");

                        console.log(res)
                        this.form.ready = true;
                        //this.downloadFileByContent(res, this.form.fileName + this.form.fileSuffix);
                        this.wmcWrite(this.getFormFilePath(), res).then(res => {
                            console.log('合并结果', res);
                            if(res) {
                                this.$message.success("合并成功，文件：" + this.getFormFilePath());
                                this.updateLocalStorage();
                                return true;
                            }

                            this.$message.error("合并失败，文件：" + this.getFormFilePath() + ', 请检查文件路径是否存在或者是否有写入权限');
                        })
                    });

                    console.log('content')
                });
            },

            fixTextArea(content) {
                if(!this.isWinOs) {
                    return content;
                }

                return content.replace(new RegExp("\n", "g"), "\r\n");
            },

            combineFile_bak() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }

                    let rawList = [];
                    let rawIds = [];
                    this.nodeList.map(node => {
                        node.fileList.map(file => {
                            rawIds.push(file.id);
                            rawList.push(file);
                        });
                    });

                    rawList.push(...this.specialFileList);
                    rawList.push(...this.specialBoxFileList);

                    if(this.dragList.length != rawList.length) {
                        this.dragList = rawList;
                    }

                    if(this.dragList.length == 0) {
                        this.$message.info('请上传要合并的文件11');
                        return false;
                    }

                    let promiseList = [];
                    this.dragList.map(file => {
                        //debugger
                        /*if(this.form.delivery && rawIds.indexOf(file.id) == -1) {
                            return false;
                        }

                        if(!this.form.delivery && rawIds.indexOf(file.id) != -1) {
                            return false;
                        }*/

                        let p = this.readFile(file, res => {
                            res = res.split("\n").filter(res => res);
                            res.splice(0, file.headerDeleteLine);
                            res.splice(res.length - file.footerDeleteLine, file.footerDeleteLine);
                            return res.join("\n");
                        });

                        promiseList.push(p);
                    });

                    if(promiseList.length == 0) {
                        this.$message.info('请上传文件33');
                        return false;
                    }

                    this.form.ready = false;
                    Promise.all([...promiseList]).then(res => {
                        console.log(res)
                        res.unshift(this.form.fileHeader);
                        res.push(this.form.fileFooter);
                        res = res.filter(res => res);
                        res = res.join("\n");

                        console.log(res)
                        this.form.ready = true;
                        //this.downloadFileByContent(res, this.form.fileName + this.form.fileSuffix);
                        this.wmcWrite(this.getFormFilePath(), res).then(res => {
                            console.log('合并结果', res);
                            if(res) {
                                this.$message.success("合并成功，文件：" + this.getFormFilePath());
                                return true;
                            }

                            this.$message.error("合并失败，文件：" + this.getFormFilePath() + ', 请检查文件路径是否存在或者是否有写入权限');
                        })
                    });

                    console.log('content')
                });
            },

            getFormFilePath() {
                return this.form.filePath + '/' + this.form.fileName + this.form.fileSuffix;
            },

            test(flag) {
                return new Promise((resolve, reject) => {
                    let time = Math.ceil(Math.random() * 10000);
                    console.warn('执行 ' + flag);
                    setTimeout(() => {
                        resolve(time + '-' + flag);
                    }, time);
                });
            },

            readFile(file, callback) {
                return new Promise((resolve, reject) => {
                    let fileReader = new FileReader();
                    fileReader.onloadend =  (event) => {
                        console.warn(event)
                        console.warn(this.detectCharset(event.target.result))
                        resolve(callback(this.fileContentDecode(event.target.result)));
                    };

                    fileReader.readAsBinaryString(file.raw);
                });
            },
            fileConfigAdd() {
                this.dispatchFileConfig(true);
            },

            fileConfigReduce() {
                this.dispatchFileConfig(false);
            },

            dispatchFileConfig(isAdd = true) {
                if(this.form.delivery) {
                    this.nodeList.map(node => {
                        node.fileList.map(file => {
                            this.doUpdateDeletedLine(file, isAdd);
                        });
                    });
                } else {
                    this.specialFileList.map(file => {
                        this.doUpdateDeletedLine(file, isAdd);
                    });
                }
            },

            doUpdateDeletedLine(file, isAdd = true) {
                let key = this.dragConfig.optionVal == 0 ? 'headerDeleteLine' : 'footerDeleteLine';
                file[key] = file[key] == undefined ? 0 : file[key];
                if(isAdd) {
                    file[key] += this.dragConfig.setVal;
                } else {
                    file[key] -= this.dragConfig.setVal;
                }

                file[key] = file[key] < 0 ? 0 : file[key];
                this.updateDeletedLine(file.id, key, file[key]);
            },

            updateDeletedLine(id, mode, value) {
                let key = this.createDeleteKey(id, mode);
                this.$refs[key].setCurrentValue(value);
            },

            dragChange(log) {
                this.dragList = log.list;
                console.log(log)

            },
            formReset() {
                this.$refs.form.resetFields();
                for(let key in this.form) {
                    if(key == 'fileSuffixOptions') {
                        continue;
                    }

                    if(this.form.hasOwnProperty(key)) {
                        this.form[key] = key == 'ready' || key == "delivery" ? true : '';
                    }
                }
            },
            removeHandle(event){
                console.log(event);
                this.$message.success(`从 ${event.from.id} 移动到 ${event.to.id} `);
            },
            addNode() {
                this.nodeList.push(this.initNode());
            },

            batchReplace() {
                this.nodeList.map((node, idx) => {
                    if(node.fileList.length == 0) {
                        return false;
                    }

                    this.doReplace(idx, true);
                });
            },

            batchDownload() {
                this.nodeList.map((node, idx) => {
                    if(node.fileList.length == 0) {
                        return false;
                    }

                    this.downloadFile(idx);
                });
            },

            clearBoxFileList() {
                if(this.form.delivery) {
                    for(let idx in this.nodeList) {
                        this.clearSearchReplace(idx);
                    }
                } else {
                    let deletedList = this.specialBoxFileList.slice(0);
                    deletedList.map((file, key) => {
                        this.closeUploadedFile(this.specialBoxKey, file, false);
                    })
                }
            },

            clearSearchReplace(idx) {

                //debugger
                if(this.nodeList[idx].fileList.length == 0) {
                    return false;
                }

                let deletedList = this.nodeList[idx].fileList.slice(0);
                console.log(deletedList)
                deletedList.map((file, key) => {
                    //debugger
                    console.warn(file.name, key)
                    this.closeUploadedFile(idx, file)
                })

                /*let node = this.initNode();
                for(let key in node) {
                    this.nodeList[idx][key] = node[key];
                }*/
            },

            closeUploadedFile(idx, file, isMulti = true) {
                let ref = this.$refs[this.createUploadKey(idx)];
                if(isMulti) {
                    ref = ref[0]
                }

                ref.handleRemove(file, file.raw);
            },
            getReplaceHis(idx) {
                if(this.nodeList[idx].replaceHis.length == 0) {
                    this.$message.info('没有替换历史');
                    return false;
                }

                let hisHtml = '';
                this.nodeList[idx].replaceHis.map((his, key) => {
                    hisHtml += `<p>#${key} ${his}<p>`;
                });

                this.$alert(hisHtml, '替换历史', {
                    dangerouslyUseHTMLString: true
                });
            },

            doReplace(idx, isBatch = false) {

                if(this.nodeList[idx].fileList.length == 0) {
                    if(!isBatch) {
                        this.$message.info("请先上传文件！");
                    }

                    return false;
                }

                let node = this.nodeList[idx];
                let replaceKey = this.createReplaceKey(node.search, node.replace);
                node.replaceHis.push(replaceKey);

                let promiseList = [];
                node.fileList.map(file => {
                    let p = this.readFile(file, res => {
                        res = res.replace(new RegExp(node.search, 'g'), node.replace);
                        //debugger
                        file.raw = new File([res], file.name, {
                            name: file.name,
                            size: res.length,
                            type: file.type,
                            uid: file.uid,
                            lastModified: file.lastModified,
                        });

                        file.raw.uid = file.uid;
                        this.$message({
                            message: file.name + ' 替换成功',
                            type: 'success'
                        });

                        return res;
                    });

                    promiseList.push(p);
                });

                Promise.all([...promiseList]).then(res => {
                    console.log('replace res: ', res);
                });
            },

            fileContentDecode(binaryStr) {
                return iconv.decode(binaryStr, this.detectCharset(binaryStr));
            },

            detectCharset(binaryStr) {
                let collect = jschardet.detectAll(binaryStr);
                let result = '';
                let confidence = 0;

                for(let idx in collect) {
                    if(collect[idx].confidence > confidence) {
                        result = collect[idx].encoding;
                        confidence = collect[idx].confidence;
                    }
                }

                if(['TIS-620', 'windows-1252'].indexOf(result) != -1) {
                    result = 'GBK';
                }

                console.error(collect, result);

                return result;
            },

            downloadFileByContent(content, fileName) {
               let file = new File([content], fileName, {
                   type: 'text/plain',
               });
               console.warn(file)
               this.downloadBlob(URL.createObjectURL(file), fileName);
            },

            downloadFile(idx) {
                if(!this.nodeList.hasOwnProperty(idx)) {
                    this.$message.info("请上传文件！");
                    return false;
                }

                if(!this.form.filePath) {
                    this.$message.info("程式保存路径未配置，请到程式串联页面配置");
                    return false;
                }

                this.nodeList[idx].fileList.map(file => {
                    let name = file.name.substring(0, file.name.lastIndexOf("."));
                    let suffix = file.name.substring(file.name.lastIndexOf("."));
                    if(this.nodeList[idx].replaceHis.length > 0) {
                        name += "(" + this.nodeList[idx].replaceHis.join(",") + ")";
                    }

                    console.warn(file.name)
                    //this.downloadBlob(url, name + suffix);
                    this.readFile(file, res => {
                        let path = this.form.filePath + "/" + name + suffix;
                        this.wmcWrite(path, res);
                        this.$message.success("程式保存成功，程式名： " + path)
                    })
                });
            },
            initNodeList() {
                for (let i = 0; i < this.nodeNum; i++) {
                    this.nodeList.push(this.initNode());
                }
            },
            initNode() {
                return {
                    search: '',
                    replace: '',
                    fileNum: 0,
                    fileList: [
                        //{name: "test.json", uid: 55555, id:1}
                    ],
                    isReplace: false,
                    replaceHis: [],
                };
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },

            handleRemove(idx) {
                return (file, fileList) => {
                    console.log(idx, file, fileList)
                    /*for(var key in fileList) {
                        if(file.name == fileList[key].name) {
                            return false;
                        }
                    }*/

                    if(idx == this.specialKey) {
                        this.specialFileList = fileList;
                    } else if(idx == this.specialBoxKey) {
                        this.specialBoxFileList = fileList;
                    } else {
                        this.nodeList[idx].fileNum--;
                        this.nodeList[idx].fileList = fileList;

                        if(fileList.length == 0) {
                            this.nodeList[idx].replaceHis = [];
                        }
                    }

                    let nameIdx = this.tmpFileNames[idx].indexOf(file.name);
                    delete this.tmpFileNames[idx][nameIdx];
                };
            },

            handlePreview(file) {
                console.log(file);
            },
            handleProgress(event, file, fileList) {
                console.log(event, file);
            },

            myHandleChange(idx) {
                return (file, fileList) => {
                    if (!this.tmpFileNames.hasOwnProperty(idx)) {
                        this.tmpFileNames[idx] = [];
                    }

                    if (this.tmpFileNames[idx].indexOf(file.name) != -1) {
                        this.$message.warning("出现重复文件： " + file.name + ", 取消当前上传！");
                        console.log(this.createUploadKey(idx))
                        console.log(this.$refs[this.createUploadKey(idx)])

                        if(idx == this.specialKey || idx == this.specialBoxKey) {
                            this.$refs[this.createUploadKey(idx)].handleRemove(file, file.raw);
                        } else {
                            this.$refs[this.createUploadKey(idx)][0].handleRemove(file, file.raw);
                        }

                        return false;
                    }

                    file.id = this.createId();
                    file.headerDeleteLine = 1;
                    file.footerDeleteLine = 1;

                    //file.
                    if(idx == this.specialKey) {
                        //debugger
                        this.specialFileList = fileList;
                        console.log(this.specialFileList)
                    } else if(idx == this.specialBoxKey) {
                        this.specialBoxFileList = fileList;
                        console.log(fileList)
                    } else {
                        this.nodeList[idx].fileNum++;
                        this.nodeList[idx].fileList = fileList;
                    }

                    this.tmpFileNames[idx].push(file.name);
                };
            },

            downloadBlob(blobUrl, fileName, revokeObjectURL) {
                let downloadElement = document.createElement('a');
                downloadElement.href = blobUrl;
                //下载后文件名
                downloadElement.download = fileName;
                console.log(fileName)
                document.body.appendChild(downloadElement);
                //点击下载
                downloadElement.click();
                //下载完成移除元素
                document.body.removeChild(downloadElement);
                if (revokeObjectURL == null || revokeObjectURL) {
                    //释放掉blob对象
                    window.URL.revokeObjectURL(blobUrl)
                }
            },

            createUploadKey(idx) {
                return 'upload' + idx;
            },

            createReplaceKey(search, replace) {
                return search + ' = ' + replace;
            },

            createId() {
                return this.curId++;
            },

            createDeleteKey(id, mode) {
                return id + '-' + mode;
            },

        }
    };
</script>
<style>
    #tab-first {
        border: none !important;;
        outline:none !important;
    }
    .wrap {
        border: 1px solid #ebebeb;
        border-radius: 3px;
        transition: .2s;
        margin-top: 20px;
        padding: 20px !important;
    }

    .wrap div {
        outline:none !important;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
    }

    .wrap *:focus {
        outline:none !important;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
    }

    *:focus {
        outline: none;
        -webkit-tap-highlight-color:rgba(0,0,0,0);
    }

    .content-overflow {
        height: 200px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .content-overflow::-webkit-scrollbar{
        width: 0;
    }

    .margin-bottom-10 {
        margin-bottom: 10px;
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
    }

    /** upload icon*/
    .my-avatar-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        text-align: center;
    }

    .my-avatar-uploader:hover {
        border-color: #409EFF;
    }

    .my-avatar-uploader .avatar-uploader-icon {
        font-size: 50px;
        color: #8c939d;
        text-align: center;
        width: 50px;
        height: 50px;
        line-height: 210px;

    }

    .my-avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

    .sr-upload-demo {
        position: relative;
        height: 100%;
        width: 100%;
    }

    .sr-upload-demo .el-upload {
        position: absolute;
        z-index: 99;
        border: 0px !important;
        background: none;
        width: 100%;
    }

    .sr-upload-demo .el-upload .el-upload-dragger {

        border: 0px !important;
        background: none;
        width: 100%;
        height: 100%;
    }

    .sr-upload-demo .el-icon-close {
        position: absolute;
        z-index: 999;
        display: block;
    }

    .upload-demo {
        position: relative;
    }

    .upload-demo .el-upload {
        position: absolute;
        z-index: 99;
        border: 0px !important;
        background: none;
        width: 100%;
    }

    .upload-demo .el-upload .el-upload-dragger {

        border: 0px !important;
        background: none;
        width: 100%;
        height: 100%;
    }

    .upload-demo .el-icon-close {
        position: absolute;
        z-index: 999;
        display: block;
    }


    #app {
        overflow: scroll;
    }

    .margin-left-3 {
        margin-left: 3px !important;
    }

    .margin-left-10 {
        margin-left: 10px;
    }

    .ml-3 {
        margin-left: 3px !important;
    }
    .mt-10 {
        margin-top: 10px;
    }

    .mb-3 {
        margin-bottom: 3px;
    }

    .large-btn {
        width: 100%;
    }


    .drag-box{
        display: flex;
        user-select: none;
    }
    .drag-box-item {
        flex: 1;
        background-color: #eff1f5;
        margin-right: 16px;
        border-radius: 6px;
        border: 1px #e1e4e8 solid;
    }
    .item-title{
        padding: 8px 8px 8px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #24292e;
        font-weight: 600;
    }
    .item-ul{
        padding: 0 8px 8px;
        max-height: 1000px;
        overflow-y: scroll;
    }
    .item-ul::-webkit-scrollbar{
        width: 0;
    }

    .overflow-text {
        display: block;
        color: #606266;
        overflow: hidden;
        max-width: 250px;
        padding-left: 4px;
        text-overflow: ellipsis;
        transition: color .3s;
        white-space: nowrap;
        line-height: 30px;
    }

    .drag-list {
        border: 1px #e1e4e8 solid;
        padding: 10px;
        margin: 5px 0 10px;
        list-style: none;
        background-color: #fff;
        border-radius: 6px;
        cursor: pointer;
        -webkit-transition: border .3s ease-in;
        transition: border .3s ease-in;
    }
    .drag-list:hover {
        border: 1px solid #20a0ff;
    }
    .drag-title {
        font-weight: 400;
        line-height: 25px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .ghost-style{
        display: block;
        color: transparent;
        border-style: dashed
    }

    .el-select .el-input {
        width: 130px;
    }

    .el-message-box {
        z-index: 99999;
        position: relative;
    }

    .min-with-80 {
        width: 80px;
    }

    .el-upload--text {
        border: 0;
    }

    .third-box {
        margin-top: 10px;
    }

    .third-box .box-card{
        background: #eff1f5;
    }

    .third-box .el-card__body{
        padding: 10px;
    }

    .third-box .content-overflow {
        background: white;
        height: 450px;
        margin-top: 5px;
        border-radius: 5px;
    }

    .third-box .box-operator {
        margin-top: 15px;
    }

    .third-box .upload-demo,.el-upload {
        width: 100%;
        height: 100%;
    }

    .third-box .upload-demo .el-icon-close {
        position: absolute;
        z-index: 999;
        display: block;
    }

    .third-box .upload-demo .el-upload-list__item-status-label {
        z-index: 998;
        display: none;
    }

    .third-box .special-input {
        width: auto;
    }

    .third-box .search {
        width: 130px;
    }

    .third-box .s-input {
        width: 100%;
    }

    .third-box .s-radio {
        width: 100%;
        height: 170px;
    }

    .third-box .s-radio .el-radio__label:before, .third-box .s-radio .el-radio__label:after {
        display: table;
        content: "";
    }

    .third-box .s-radio .el-radio__label:after {
        clear: both;
    }



    .third-box .t-close {
        font-size: 20px;
        margin-top: -10px;
        cursor: pointer;
    }
    .third-box .t-close i{
        display: inline-block;
        width: 100%;
        height: 100%;
    }

   .third-box .box-card-title {
        display: block;
        position: absolute;
        top: 0px;
        z-index: 999;
        background: white;
    }

    .third-box .folder-content {
        border-radius: 5px;
        border: 1px solid #8080805e;
        height: 450px;
        overflow: scroll;
        margin-top: 10px;
    }

    .third-box .folder-select-title {
        font-weight: bold;
    }



</style>
