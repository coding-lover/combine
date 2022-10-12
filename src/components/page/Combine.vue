<template>
    <el-row :gutter="10">
        <el-col :span="18" :offset="3" class="wrap">
            <el-tabs v-model="activeName" @tab-click="handleClick">

                <el-tab-pane  name="first" class="wrap-padding">
                    <span slot="label">文件替换<el-badge :value="totalNum" class="large-btn" :hidden="totalNum > 0 ? false : true" ></el-badge></span>

                    <el-col :span="12" class="margin-bottom-10" v-for="(item, idx) in nodeList">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <el-col :span="6">
                                    <el-input v-model="item.search" prefix-icon="el-icon-search" placeholder="要替换字符"></el-input>
                                </el-col>
                                <el-col :span="6">
                                    <el-input v-model="item.replace" prefix-icon="el-icon-edit" placeholder="替换后字符"></el-input>
                                </el-col>
                                <el-badge :value="item.fileNum" class="" :hidden="item.fileNum > 0 ? false : true">
                                    <el-button v-show="!replaceFlag(idx)" size="small" class="ml-3" type="primary"
                                               @click="doReplace(idx)">替换
                                    </el-button>
                                    <el-button v-show="replaceFlag(idx)" class="ml-3" size="small" type="success">已替换</el-button>
                                    <el-button size="small" type="success" class="ml-3" @click="getReplaceHis(idx)">替换历史</el-button>
                                </el-badge>
                                <el-button size="small" type="primary" class="margin-left-3" @click="downloadFile(idx)">下载</el-button>

                            </div>
                            <div class="content-overflow">
                                <el-upload
                                        class="upload-demo"
                                        drag
                                        :ref="createUploadKey(idx)"
                                        action=""
                                        :on-preview="handlePreview"
                                        :on-remove="handleRemove(idx)"
                                        :on-progress="handleProgress"
                                        :on-change="myHandleChange(idx)"
                                        :file-list="fileList"
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


                <el-tab-pane label="文件合并" name="second">
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

                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
    import ElTableDraggable from 'element-ui-el-table-draggable';

    export default {
        data() {
            return {
                activeName: 'first',
                fileList: [],
                tmpFileNames: [],
                nodeList: [],
                nodeNum: 2,
                replaceHis: [],
                specialFileList: [],
                specialKey: 99,
                form: {
                    fileHeader: '',
                    fileFooter: '',
                    fileName: '',
                    fileSuffix: ".nc",
                    fileSuffixOptions: [
                        {value: ".nc", name: ".nc"},
                        {value: ".pim", name: ".pim"},
                    ],
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
                }
            };
        },
        components:{
            ElTableDraggable
        },
        computed: {
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
                        fileList.push(...this.specialFileList);
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
        },
        mounted() {
            this.initNodeList();
        },

        methods: {
            combineFile() {
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

                    if(this.dragList.length != rawList.length) {
                        this.dragList = rawList;
                    }

                    if(this.dragList.length == 0) {
                        this.$message.info('请上传要合并的文件');
                        return false;
                    }

                    let promiseList = [];
                    this.dragList.map(file => {
                        //debugger
                        if(this.form.delivery && rawIds.indexOf(file.id) == -1) {
                            return false;
                        }

                        if(!this.form.delivery && rawIds.indexOf(file.id) != -1) {
                            return false;
                        }

                        let p = this.readFile(file, res => {
                            res = res.split("\n").filter(res => res);
                            res.splice(0, file.headerDeleteLine);
                            res.splice(res.length - file.footerDeleteLine, file.footerDeleteLine);
                            return res.join("\n");
                        });

                        promiseList.push(p);
                    });

                    if(promiseList.length == 0) {
                        this.$message.info('请上传文件');
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
                        this.downloadFileByContent(res, this.form.fileName + this.form.fileSuffix);
                    });

                    console.log('content')
                });
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

                        resolve(callback(event.target.result));
                    };

                    fileReader.readAsText(file.raw);
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
                    this.doReplace(idx);
                });
            },

            batchDownload() {
                this.nodeList.map((node, idx) => {
                    this.downloadFile(idx);
                });
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

            doReplace(idx) {

                if(this.nodeList[idx].fileList.length == 0) {
                    this.$message.info("请先上传文件！");
                    return false;
                }

                let node = this.nodeList[idx];
                let replaceKey = this.createReplaceKey(node.search, node.replace);
                node.replaceHis.push(replaceKey);

                node.fileList.map(file => {
                    let fileReader = new FileReader();
                    fileReader.onload =  (event) => {
                        //console.log(event.target.result)
                        let content = event.target.result.replaceAll(node.search, node.replace);
                        console.info("replace: " + content);
                        file.raw = new File([content], file.name, {
                            name: file.name,
                            size: content.length,
                            type: file.type,
                            lastModified: file.lastModified,
                        });

                        this.$message({
                            message: file.name + ' 替换成功',
                            type: 'success'
                        });
                    };

                    fileReader.readAsText(file.raw);

                });

                this.$message({
                    message: idx + '-' + replaceKey,
                    type: 'success'
                });
            },

            downloadFileByContent(content, fileName) {
               let file = new File([content], fileName);
               this.downloadBlob(URL.createObjectURL(file), fileName);
            },

            downloadFile(idx) {
                if(!this.nodeList.hasOwnProperty(idx)) {
                    this.$message.info("请上传文件！");
                    return false;
                }

                this.nodeList[idx].fileList.map(file => {
                    let url = URL.createObjectURL(file.raw);
                    let name = file.name.substring(0, file.name.lastIndexOf("."));
                    let suffix = file.name.substring(file.name.lastIndexOf("."));
                    if(this.nodeList[idx].replaceHis.length > 0) {
                        name += "(" + this.nodeList[idx].replaceHis.join(",") + ")";
                    }

                    console.warn(file.name)
                    this.downloadBlob(url, name + suffix);
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
                    console.log(file, fileList)
                    for(var key in fileList) {
                        if(file.name == fileList[key].name) {
                            return false;
                        }
                    }

                    if(idx == this.specialKey) {
                        this.specialFileList = fileList;
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

                        if(idx == this.specialKey) {
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
    .wrap {
        border: 1px solid #ebebeb;
        border-radius: 3px;
        transition: .2s;
        padding: 10px;
        margin-top: 20px;
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
        margin-left: 3px;
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

</style>
