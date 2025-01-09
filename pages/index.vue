<template>
  <div class="container mx-auto p-4">
    <UCard class="mb-4">
      <template #header>
        <h3 class="text-lg font-bold">ER图生成器</h3>
      </template>

      <div class="space-y-4">
        <!-- SQL输入区域 -->
        <UTextarea
          v-model="sql"
          :rows="8"
          placeholder="请输入SQL语句..."
          class="font-mono"
        />

        <!-- 操作按钮 -->
        <div class="flex gap-4">
          <UButton
            icon="i-mdi-upload"
            @click="triggerFileUpload"
          >
            上传SQL文件
          </UButton>
          <UButton
            color="primary"
            icon="i-mdi-play"
            :loading="isGenerating"
            @click="generateER"
          >
            生成ER图
          </UButton>
        </div>

        <!-- 隐藏的文件上传input -->
        <input
          ref="fileInput"
          type="file"
          accept=".sql"
          class="hidden"
          @change="handleFileUpload"
        >
      </div>
    </UCard>

    <!-- ER图显示区域 -->
    <ErDiagram
      v-if="erDiagram"
      :diagram="erDiagram"
    />
  </div>
</template>

<script setup lang="ts">
const { sql, erDiagram, isGenerating, generateER, handleFileUpload } = useErGenerator()
const fileInput = ref<HTMLInputElement>()

const triggerFileUpload = () => {
  fileInput.value?.click()
}
</script> 