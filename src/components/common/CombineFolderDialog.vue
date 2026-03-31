
<template>
    <el-dialog title="选择保存的目录" :visible="visible" @update:visible="val => $emit('update:visible', val)">
        <div class="pb-10">
            <span class="folder-select-title">当前选中: </span>
            <span v-show="!selectedFolderStr" style="color:red;">未选中文件夹</span>
            <span v-show="selectedFolderStr">{{ selectedFolderStr }}</span>
        </div>
        <div class="folder-content">
            <el-cascader v-model="folderValueLocal" :options="folderOptions" :props="folderProps" clearable
                @change="onChange">
            </el-cascader>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="$emit('save')">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'CombineFolderDialog',
    props: {
        visible: Boolean,
        selectedFolderStr: String,
        folderValue: Array,
        folderOptions: Array,
        folderProps: Object
    },
    computed: {
        folderValueLocal: {
            get() { return this.folderValue; },
            set(val) { this.$emit('update:folderValue', val); }
        }
    },
    methods: {
        onChange(val) {
            this.$emit('change', val);
        }
    }
};
</script>
