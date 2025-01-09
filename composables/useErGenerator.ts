export const useErGenerator = () => {
  const sql = ref('')
  const erDiagram = ref('')
  const isGenerating = ref(false)
  const toast = useToast()

  const generateER = async () => {
    if (!sql.value.trim()) {
      toast.add({
        title: '错误',
        description: '请输入SQL语句',
        color: 'red'
      })
      return
    }

    isGenerating.value = true
    try {
      const response = await $fetch('/api/generate-er', {
        method: 'POST',
        body: { sql: sql.value }
      })

      console.log('Generated diagram:', response.erDiagram)

      if (response && response.erDiagram) {
        erDiagram.value = response.erDiagram
        toast.add({
          title: '成功',
          description: 'ER图生成成功',
          color: 'green'
        })
      } else {
        throw new Error('未获取到ER图数据')
      }
    } catch (error) {
      console.error('Generate ER Error:', error)
      toast.add({
        title: '错误',
        description: error instanceof Error ? error.message : '生成ER图失败',
        color: 'red'
      })
    } finally {
      isGenerating.value = false
    }
  }

  const handleFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      sql.value = text
      toast.add({
        title: '成功',
        description: '文件上传成功',
        color: 'green'
      })
    } catch (error) {
      console.error('File Upload Error:', error)
      toast.add({
        title: '错误',
        description: '文件读取失败',
        color: 'red'
      })
    }
  }

  return {
    sql,
    erDiagram,
    isGenerating,
    generateER,
    handleFileUpload
  }
} 