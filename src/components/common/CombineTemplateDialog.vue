
<template>
    <el-dialog title="选择文件尾模板" :visible="visible" @update:visible="val => $emit('update:visible', val)">
        <el-form class="template-dialog">
            <div v-for="(item, key) in templateList" :key="key">
                <el-form-item label="" prop="fileName">
                    <el-col :span="23">
                        <el-radio v-model="selectedTemplateLocal" :label="key" border class="s-radio clearfix">
                            <el-form label-width="150px" class="template-form">
                                <el-form-item label="模板名" prop="templateName">
                                    <el-input placeholder="模板名" v-model="item.templateName"></el-input>
                                </el-form-item>
                                <el-form-item label="文件头删除行数" prop="fileHeaderDeletedLine">
                                    <el-select v-model="item.fileHeaderDeletedLine" placeholder="请选择">
                                        <el-option v-for="num in 20" :key="num" :label="num" :value="num"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="文件尾删除行数" prop="fileFooterDeletedLine">
                                    <el-select v-model="item.fileFooterDeletedLine" placeholder="请选择">
                                        <el-option v-for="num in 20" :key="num" :label="num" :value="num"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="文件头增加" prop="fileHeader">
                                    <el-input type="textarea" v-model="item.fileHeader" :autosize="{ minRows: 3 }"></el-input>
                                </el-form-item>
                                <el-form-item label="文件尾增加" prop="fileFooter" class="clearfix">
                                    <el-input type="textarea" v-model="item.fileFooter" :autosize="{ minRows: 3 }"></el-input>
                                </el-form-item>
                                <el-form-item label="串联程式新名" prop="fileName">
                                    <el-input placeholder="串联程式新名" v-model="item.fileName" class="input-with-select">
                                        <el-select v-model="item.fileSuffix" slot="append" placeholder="请选择">
                                            <el-option v-for="SuffixItem in fileSuffixOptions"
                                                :key="SuffixItem.value" :label="SuffixItem.name"
                                                :value="SuffixItem.value">
                                            </el-option>
                                        </el-select>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="文件保存路径" prop="filePath">
                                    <el-input placeholder="文件保存路径" v-model="item.filePath" class="input-with-select mt-10" readonly>
                                        <el-button slot="append" icon="el-icon-folder" type="success" @click="$emit('open-folder', key)"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-radio>
                    </el-col>
                    <el-col :span="1" title="删除">
                        <i class="el-icon-close t-close" @click="$emit('delete-template', key)"></i>
                    </el-col>
                </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="$emit('add-template')">增 加</el-button>
            <el-button type="primary" @click="onSave">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'CombineTemplateDialog',
    props: {
        visible: Boolean,
        templateList: Array,
        selectedTemplate: [Number, String],
        fileSuffixOptions: Array
    },
    computed: {
        selectedTemplateLocal: {
            get() { return this.selectedTemplate; },
            set(val) { this.$emit('update:selectedTemplate', val); }
        }
    },
    methods: {
        onSave() {
            this.$emit('save');
        }
    }
};
</script>
