// 代码生成时间: 2025-09-19 02:47:15
import { defineComponent, ref } from 'vue';
import fs from 'fs';
import path from 'path';

export default defineComponent({
  name: 'BatchRenameTool',
  data() {
    return {
      files: [] as File[],
      newName: '',
      errorMessage: '' as string | null,
    };
  },
  methods: {
    handleFileChange(event: Event) {
      const files = (event.target as HTMLInputElement).files;
      if (!files) {
        this.errorMessage = 'No files selected.';
        return;
      }
      this.files = Array.from(files);
      this.errorMessage = null;
    },
    renameFiles() {
      if (this.files.length === 0) {
        this.errorMessage = 'Please select files to rename.';
        return;
      }
      if (!this.newName) {
        this.errorMessage = 'Please enter a new name pattern.';
        return;
      }
      try {
        for (const file of this.files) {
          const directory = path.dirname(file.webkitRelativePath);
          const filename = path.basename(file.webkitRelativePath, path.extname(file.webkitRelativePath));
          const extension = path.extname(file.webkitRelativePath);
          const newFilename = `${this.newName}_${filename}${extension}`;
          const oldPath = file.webkitRelativePath;
          const newPath = path.join(directory, newFilename);
          fs.renameSync(oldPath, newPath);
        }
        this.errorMessage = null;
        alert('Files renamed successfully.');
      } catch (error) {
        this.errorMessage = `Error renaming files: ${error.message}`;
      }
    },
  },
});
</script>

<style scoped>
.batch-rename-tool {
  margin: 20px;
}
.error-message {
  color: red;
}
</style>