
<template>
    <el-row :gutter="10">
        <el-col :span="24" :offset="0" class="wrap">
            <el-tabs v-model="activeName">
                <!-- 程式替换 Tab -->
                <el-tab-pane name="first">
                    <span slot="label">
                        程式替换
                        <el-badge :value="totalNum" class="large-btn" :hidden="totalNum <= 0"></el-badge>
                    </span>
                    <combine-replace-tab 
                        :node-list="nodeList" 
                        :total-num="totalNum"
                        @add-node="addNode"
                        @replace="doReplace"
                        @download="downloadFile"
                        @clear="clearSearchReplace"
                        @show-history="getReplaceHis"
                        @remove-file="handleRemove"
                        @change-file="myHandleChange"
                        @batch-replace="batchReplace"
                        @batch-download="batchDownload"
                    />
                </el-tab-pane>

                <!-- 程式串联 Tab -->
                <el-tab-pane label="程式串联" name="third" class="third-box">
                    <combine-merge-tab 
                        ref="mergeTab"
                        :form="form"
                        :form-rules="formRules"
                        :special-box-file-list="specialBoxFileList"
                        :special-box-key="specialBoxKey"
                        :file-list="getFileList"
                        :combine-file-num="getCombineFileNum"
                        @switch-tab="name => activeName = name"
                        @delete-node-file="deleteNodeListFile"
                        @combine="combineFile"
                        @clear-box="clearBoxFileList"
                        @remove-file="handleRemove"
                        @change-file="myHandleChange"
                        @open-folder="openFolder"
                        @show-template="showTemplate"
                        @save-template="saveTemplate"
                    />
                </el-tab-pane>

                <!-- 串联历史 Tab -->
                <el-tab-pane name="history">
                    <span slot="label">
                        串联历史
                        <el-badge :value="combineHisNum" class="large-btn" :hidden="combineHisNum <= 0"></el-badge>
                    </span>
                    <combine-history-tab 
                        :combine-his-num="combineHisNum"
                        :combine-his-list="getCombineHisList"
                        @del-his="delHis"
                        @del-all-his="delAllHis"
                    />
                </el-tab-pane>
            </el-tabs>
        </el-col>

        <!-- 模板管理 Dialog -->
        <combine-template-dialog 
            :visible.sync="dialogFormVisible"
            :template-list="form.templateList"
            :selected-template.sync="form.selectedTemplate"
            :file-suffix-options="form.fileSuffixOptions"
            @add-template="addTemplate"
            @delete-template="deleteTemplate"
            @open-folder="openFolder"
            @save="dialogSaveTemplate"
        />

        <!-- 目录选择 Dialog -->
        <combine-folder-dialog 
            :visible.sync="dialogFolderSelectVisible"
            :selected-folder-str="getCurFolder"
            :folder-value.sync="folderValue"
            :folder-options="folderOptions"
            :folder-props="folderProps"
            @change="handleFolderChange"
            @save="dialogSaveFolder"
        />
    </el-row>
</template>

<script>
import CombineReplaceTab from '../common/CombineReplaceTab.vue';
import CombineMergeTab from '../common/CombineMergeTab.vue';
import CombineHistoryTab from '../common/CombineHistoryTab.vue';
import CombineTemplateDialog from '../common/CombineTemplateDialog.vue';
import CombineFolderDialog from '../common/CombineFolderDialog.vue';

import * as tauriService from '@/utils/tauriService';
import * as fileUtils from '@/utils/fileUtils';
import jschardet from 'jschardet';
import { window } from '@tauri-apps/api';

import '@/assets/css/combine.css';

export default {
    name: 'Combine',
    components: {
        CombineReplaceTab,
        CombineMergeTab,
        CombineHistoryTab,
        CombineTemplateDialog,
        CombineFolderDialog
    },
    data() {
        return {
            activeName: 'third',
            loading: false,
            nodeList: [],
            nodeNum: 1,
            specialBoxFileList: [],
            specialBoxKey: 98,
            specialKey: 99,
            curId: 0,
            tmpFileNames: {},
            combineHis: [],
            dialogFormVisible: false,
            dialogFolderSelectVisible: false,
            operatorTemplateIdx: -1,
            selectedFolder: [],
            folderValue: [],
            folderOptions: [],
            isWinOs: navigator.userAgent.toLowerCase().indexOf('windows') !== -1,
            folderProps: {
                checkStrictly: true,
                lazy: true,
                lazyLoad: (node, resolve) => {
                    const path = node.path.join('/');
                    this.readFolderAndResolve({ ...node, path }, resolve);
                }
            },
            form: {
                fileHeader: '',
                fileFooter: '',
                fileName: '',
                filePath: '',
                fileHeaderDeletedLine: 1,
                fileFooterDeletedLine: 1,
                fileSuffix: ".nc",
                fileSuffixOptions: [
                    { value: ".nc", name: ".nc" },
                    { value: ".pim", name: ".pim" },
                ],
                templateList: [],
                selectedTemplate: 0,
                templateName: '',
                ready: true,
                delivery: false,
            },
            formRules: {
                fileHeader: [{ required: true, message: '请输入文件头', trigger: 'blur' }],
                fileFooter: [{ required: true, message: '请输入文件尾', trigger: 'change' }],
                fileName: [{
                    required: true, message: '请输入完整文件名', trigger: 'change', validator: (rule, value, callback) => {
                        if (!this.form.fileName) return callback(new Error('请输入完整文件名'));
                        if (!this.form.fileSuffix) return callback(new Error('请选择文件后缀'));
                        callback();
                    }
                }],
                filePath: [{ required: true, message: '请配置保存路径', trigger: 'blur' }]
            }
        };
    },
    computed: {
        totalNum() {
            return this.nodeList.reduce((acc, node) => acc + node.fileList.length, 0);
        },
        combineHisNum() {
            return this.combineHis.length;
        },
        getCombineFileNum() {
            return this.form.delivery ? this.totalNum : this.specialBoxFileList.length;
        },
        getCurFolder() {
            return this.selectedFolder.join('/');
        },
        getCombineHisList() {
            return [...this.combineHis].sort((a, b) => b.create_at.localeCompare(a.create_at));
        },
        getFileList() {
            if (!this.form.delivery) return [];
            let list = [];
            this.nodeList.forEach((node, nodeIdx) => {
                node.fileList.forEach((file, fileIdx) => {
                    list.push({ ...file, nodeIdx, fileIdx });
                });
            });
            return list;
        }
    },
    watch: {
        "form.selectedTemplate"(val) {
            this.selectTemplate(val);
        },
        "form.filePath"(val) {
            this.validateConfigForm();
        },
    },
    mounted() {
        this.initNodeList();
        this.initParams();
        this.initFolder();
        setTimeout(() => this.closeLoading(), 200);
    },
    methods: {
        validateConfigForm() {
            const tab = this.$refs.mergeTab;
            if (!tab || !tab.$refs || !tab.$refs.form) return;
            
            tab.$refs.form.validate(async (valid) => {
                if (!valid) return;
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
                fileList: [],
                replaceHis: [],
            };
        },
        initParams() {
            const hisCache = JSON.parse(localStorage.getItem('combine-his'));
            if (hisCache) this.combineHis = hisCache;

            const formCache = JSON.parse(localStorage.getItem('form'));
            if (formCache) {
                Object.keys(formCache).forEach(key => {
                    if (this.form.hasOwnProperty(key)) {
                        this.form[key] = formCache[key];
                    }
                });
            }
        },
        initFolder() {
            if (this.isWinOs) {
                ['C:/', 'D:/', 'E:/', 'F:/'].forEach(dir => {
                    this.folderOptions.push({ value: dir, label: dir, children: [] });
                });
            } else {
                this.folderOptions.push({ value: '/data', label: '/data', children: [] });
            }
        },
        openLoading() {
            this.loading = this.$loading({
                lock: true,
                text: '处理中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
        },
        closeLoading() {
            if (this.loading) {
                this.loading.close();
                this.loading = null;
            }
        },
        handleFolderChange(value) {
            this.selectedFolder = Array.isArray(value) ? value : value.split('/');
        },
        async readFolderAndResolve(node, resolve) {
            try {
                const res = await tauriService.readDir(node.path);
                const subNodes = res
                    .filter(item => item.is_dir)
                    .map(item => {
                        const name = fileUtils.basename(item.path);
                        return { value: name, label: name };
                    });
                resolve(subNodes);
            } catch (error) {
                console.error('Read folder failed:', error);
                resolve([]);
            }
        },
        dialogSaveFolder() {
            this.dialogFolderSelectVisible = false;
            const path = this.selectedFolder.join('/');
            if (this.operatorTemplateIdx === -1) {
                this.form.filePath = path;
            } else if (this.form.templateList[this.operatorTemplateIdx]) {
                this.form.templateList[this.operatorTemplateIdx].filePath = path;
            }
            this.updateLocalStorage();
        },
        openFolder(idx) {
            this.operatorTemplateIdx = idx;
            this.dialogFolderSelectVisible = true;
            let path = '';
            if (idx === -1) {
                path = this.form.filePath;
            } else if (this.form.templateList[idx]) {
                path = this.form.templateList[idx].filePath || '';
            }
            this.folderValue = path ? path.split('/') : [];
            this.selectedFolder = this.folderValue;
        },
        addNode() {
            this.nodeList.push(this.initNode());
        },
        handleRemove({ idx, file, fileList }) {
            if (idx === this.specialBoxKey) {
                this.specialBoxFileList = fileList;
            } else {
                const node = this.nodeList[idx];
                if (node) {
                    node.fileNum = fileList.length;
                    node.fileList = fileList;
                    if (fileList.length === 0) node.replaceHis = [];
                }
            }
            if (this.tmpFileNames[idx]) {
                const nameIdx = this.tmpFileNames[idx].indexOf(file.name);
                if (nameIdx > -1) this.tmpFileNames[idx].splice(nameIdx, 1);
            }
        },
        async myHandleChange({ idx, file, fileList }) {
            this.openLoading();
            const beginTime = Date.now();
            debugger
            if (!this.tmpFileNames[idx]) this.tmpFileNames[idx] = [];
            
            if (this.tmpFileNames[idx].indexOf(file.name) !== -1) {
                this.$message.warning(`重复文件: ${file.name}`);
                this.closeLoading();
                return;
            }

            try {
                file.id = this.curId++;
                file.beginTime = beginTime;
                const content = await this.readFileAsync(file);
                file.content = content;
                file.finishTime = Date.now();

                if (idx === this.specialBoxKey) {
                    this.specialBoxFileList = fileList;
                } else {
                    const node = this.nodeList[idx];
                    node.fileNum = fileList.length;
                    node.fileList = fileList;
                }
                this.tmpFileNames[idx].push(file.name);
            } catch (error) {
                this.$message.error('文件读取失败');
            } finally {
                this.closeLoading();
            }
        },
        readFileAsync(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const binary = e.target.result;
                    const encoding = this.detectEncoding(binary);
                    const textReader = new FileReader();
                    textReader.onload = (ev) => resolve(ev.target.result);
                    textReader.onerror = reject;
                    textReader.readAsText(file.raw, encoding);
                };
                reader.onerror = reject;
                reader.readAsBinaryString(file.raw.slice(0, 1000));
            });
        },
        detectEncoding(binaryStr) {
            const results = jschardet.detectAll(binaryStr);
            let best = { encoding: 'UTF-8', confidence: 0 };
            results.forEach(res => {
                if (res.confidence > best.confidence) best = res;
            });
            if (['TIS-620', 'windows-1252'].indexOf(best.encoding) !== -1) return 'GBK';
            return best.encoding;
        },
        async doReplace(idx) {
            const node = this.nodeList[idx];
            if (!node || node.fileList.length === 0) {
                this.$message.info("请先上传文件！");
                return;
            }

            const replaceKey = `${node.search} = ${node.replace}`;
            node.replaceHis.push(replaceKey);

            this.openLoading();
            try {
                const promises = node.fileList.map(async file => {
                    const content = await this.readFileAsync(file);
                    const newContent = content.replace(new RegExp(node.search, 'g'), node.replace);
                    file.raw = new File([newContent], file.name, { type: file.raw.type });
                    file.content = newContent;
                    this.$message.success(`${file.name} 替换成功`);
                });
                await Promise.all(promises);
            } catch (error) {
                this.$message.error('替换过程中出错');
            } finally {
                this.closeLoading();
            }
        },
        batchReplace() {
            this.nodeList.forEach((node, idx) => {
                if (node.fileList.length > 0) this.doReplace(idx);
            });
        },
        async downloadFile(idx) {
            const node = this.nodeList[idx];
            if (!node || node.fileList.length === 0) {
                this.$message.info("请先上传文件！");
                return;
            }
            if (!this.form.filePath) {
                this.$message.info("请先配置保存路径");
                return;
            }

            for (const file of node.fileList) {
                const path = `${this.form.filePath}/${file.name}`;
                try {
                    await tauriService.writeFile(path, file.content);
                    this.$message.success(`保存成功: ${path}`);
                } catch (error) {
                    this.$message.error(`保存失败: ${path}`);
                }
            }
        },
        batchDownload() {
            this.nodeList.forEach((node, idx) => {
                if (node.fileList.length > 0) this.downloadFile(idx);
            });
        },
        clearSearchReplace(idx) {
            debugger
            const node = this.nodeList[idx];
            if (!node) return;
            node.fileList = [];
            node.fileNum = 0;
            node.replaceHis = [];
            if (this.tmpFileNames[idx]) this.tmpFileNames[idx] = [];
        },
        getReplaceHis(idx) {
            const node = this.nodeList[idx];
            if (!node || node.replaceHis.length === 0) {
                this.$message.info('没有替换历史');
                return;
            }
            const html = node.replaceHis.map((his, i) => `<p>#${i} ${his}</p>`).join('');
            this.$alert(html, '替换历史', { dangerouslyUseHTMLString: true });
        },
        deleteNodeListFile({ nodeIdx, fileId }) {
            const node = this.nodeList[nodeIdx];
            if (!node) return;
            const fileIdx = node.fileList.findIndex(f => f.id === fileId);
            if (fileIdx > -1) {
                node.fileList.splice(fileIdx, 1);
                node.fileNum = node.fileList.length;
            }
        },
        clearBoxFileList() {
            if (this.form.delivery) {
                this.nodeList.forEach((_, idx) => this.clearSearchReplace(idx));
            } else {
                this.specialBoxFileList = [];
                if (this.tmpFileNames[this.specialBoxKey]) {
                    this.tmpFileNames[this.specialBoxKey] = [];
                }
            }
        },
        combineFile() {
            const tab = this.$refs.mergeTab;
            if (!tab || !tab.$refs || !tab.$refs.form) return;
            
            tab.$refs.form.validate(async (valid) => {
                if (!valid) return;

                const rawList = this.form.delivery 
                    ? this.nodeList.reduce((acc, n) => acc.concat(n.fileList), [])
                    : this.specialBoxFileList;

                if (rawList.length === 0) {
                    this.$message.info('请上传要合并的文件');
                    return;
                }

                this.form.ready = false;
                const startTime = Date.now();
                let totalFileSpendTime = 0;
                let combinedContent = '';

                rawList.forEach(file => {
                    if (file.beginTime && file.finishTime) {
                        totalFileSpendTime += (file.finishTime - file.beginTime);
                    }
                    let content = fileUtils.removeLineFromStr(file.content, this.form.fileHeaderDeletedLine);
                    content = fileUtils.removeLineFromStr(content, -this.form.fileFooterDeletedLine);
                    combinedContent += content + "\r\n";
                });

                combinedContent = fileUtils.removeLineFromStr(combinedContent, -1);
                const header = fileUtils.fixTextArea(this.form.fileHeader, this.isWinOs);
                const footer = fileUtils.fixTextArea(this.form.fileFooter, this.isWinOs);
                combinedContent = `${header}\r\n${combinedContent}\r\n${footer}`;

                const targetPath = `${this.form.filePath}/${this.form.fileName}${this.form.fileSuffix}`;
                
                try {
                    const success = await tauriService.writeFile(targetPath, combinedContent);
                    if (success) {
                        const endTime = Date.now();
                        const spendTime = fileUtils.formatTimeDifference(endTime - startTime);
                        const totalSpendTime = fileUtils.formatTimeDifference(endTime - startTime + totalFileSpendTime);

                        this.combineHis.push({
                            name: targetPath,
                            create_at: fileUtils.getDatetime(),
                            spendTime,
                            totalSpendTime,
                            children: rawList.map(f => ({
                                name: f.name,
                                time: f.beginTime ? fileUtils.formatTimeDifference(f.finishTime - f.beginTime) : '--'
                            }))
                        });
                        this.updateLocalStorage();
                        this.$message.success(`合并成功: ${targetPath}`);
                    } else {
                        throw new Error('Write failed');
                    }
                } catch (error) {
                    this.$message.error(`合并失败: ${targetPath}`);
                } finally {
                    this.form.ready = true;
                }
            });
        },
        addTemplate() {
            this.form.templateList.push({
                templateName: '',
                fileHeader: '',
                fileFooter: '',
                fileName: '',
                filePath: '',
                fileHeaderDeletedLine: 1,
                fileFooterDeletedLine: 1,
                fileSuffix: '.nc'
            });
        },
        deleteTemplate(idx) {
            this.form.templateList.splice(idx, 1);
            this.updateLocalStorage();
        },
        showTemplate() {
            this.dialogFormVisible = true;
        },
        saveTemplate() {
            if (!this.form.templateName) return this.$message.info('请输入模板名称');
            const template = JSON.parse(JSON.stringify(this.form));
            delete template.templateList;
            
            const existingIdx = this.form.templateList.findIndex(t => t.templateName === this.form.templateName);
            if (existingIdx > -1) {
                this.$set(this.form.templateList, existingIdx, template);
            } else {
                this.form.templateList.push(template);
            }
            this.updateLocalStorage();
            this.$message.success('模板保存成功');
        },
        dialogSaveTemplate() {
            this.dialogFormVisible = false;
            this.selectTemplate(this.form.selectedTemplate);
            this.updateLocalStorage();
        },
        selectTemplate(idx) {
            const template = this.form.templateList[idx];
            if (!template) return;
            Object.keys(template).forEach(key => {
                if (this.form.hasOwnProperty(key)) {
                    this.form[key] = template[key];
                }
            });
            this.selectedFolder = template.filePath ? template.filePath.split('/') : [];
        },
        updateLocalStorage() {
            localStorage.setItem('form', JSON.stringify(this.form));
            localStorage.setItem('combine-his', JSON.stringify(this.combineHis));
        },
        delHis(idx) {
            this.combineHis.splice(idx, 1);
            this.updateLocalStorage();
        },
        delAllHis() {
            this.combineHis = [];
            this.updateLocalStorage();
        }
    }
};
</script>
