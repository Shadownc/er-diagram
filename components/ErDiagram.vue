<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold">ER图</h3>
        <UButton
          icon="i-mdi-download"
          @click="downloadPng"
          :disabled="!diagramInitialized"
        >
          下载PNG
        </UButton>
      </div>
    </template>

    <div class="overflow-auto p-4 relative">
      <div v-if="loading" class="absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
        <div class="i-mdi-loading animate-spin text-2xl" />
      </div>
      <div ref="diagramDiv" class="diagram-container"></div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import * as go from 'gojs'

const props = defineProps<{
  diagram: string
}>()

const diagramDiv = ref<HTMLElement>()
const loading = ref(false)
const diagramInitialized = ref(false)
let myDiagram: go.Diagram | null = null

onMounted(() => {
  initDiagram()
})

const initDiagram = () => {
  if (!diagramDiv.value) return

  const $ = go.GraphObject.make

  myDiagram = $(go.Diagram, diagramDiv.value, {
    "undoManager.isEnabled": true,
    layout: $(go.LayeredDigraphLayout, {
      direction: 0,
      layerSpacing: 100,
      columnSpacing: 50
    })
  })

  // 实体模板（矩形）
  myDiagram.nodeTemplateMap.add("entity",
    $(go.Node, "Auto",
      $(go.Shape, "Rectangle", {
        fill: "lightblue",
        strokeWidth: 2
      }),
      $(go.TextBlock, {
        margin: 10,
        font: "bold 14px sans-serif"
      },
      new go.Binding("text", "name"))
    )
  )

  // 属性模板（椭圆）
  myDiagram.nodeTemplateMap.add("attribute",
    $(go.Node, "Auto",
      $(go.Shape, "Ellipse", {
        fill: "lightblue",
        strokeWidth: 2,
        width: 80,
        height: 40
      }),
      $(go.TextBlock, {
        margin: 8,
        font: "12px sans-serif"
      },
      new go.Binding("text", "name"))
    )
  )

  // 关系模板（菱形）
  myDiagram.nodeTemplateMap.add("relationship",
    $(go.Node, "Auto",
      $(go.Shape, "Diamond", {
        fill: "darkblue",
        strokeWidth: 2,
        width: 80,
        height: 80
      }),
      $(go.TextBlock, {
        margin: 8,
        font: "12px sans-serif",
        stroke: "white"
      },
      new go.Binding("text", "name"))
    )
  )

  // 连接线模板
  myDiagram.linkTemplate = $(go.Link, {
      routing: go.Link.Normal,
      curve: go.Link.Bezier
    },
    $(go.Shape, {
      strokeWidth: 1.5
    }),
    $(go.TextBlock, {
      segmentOffset: new go.Point(0, -10),
      font: "12px sans-serif"
    },
    new go.Binding("text", "cardinality"))
  )

  diagramInitialized.value = true
  updateDiagram()
}

const updateDiagram = () => {
  if (!myDiagram || !props.diagram) return

  try {
    loading.value = true
    const data = JSON.parse(props.diagram)
    
    const nodeDataArray = [
      ...data.entities,
      ...data.attributes,
      ...data.relationships
    ]
    
    const linkDataArray = [
      ...data.attributes.map(attr => ({
        from: attr.entityKey,
        to: attr.key
      })),
      ...data.relationships.flatMap(rel => ([
        {
          from: rel.from,
          to: rel.key,
          cardinality: rel.fromCardinality
        },
        {
          from: rel.key,
          to: rel.to,
          cardinality: rel.toCardinality
        }
      ]))
    ]

    myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray)
  } catch (e) {
    console.error('Update diagram error:', e)
  } finally {
    loading.value = false
  }
}

watch(() => props.diagram, updateDiagram)

const downloadPng = () => {
  if (!myDiagram) return
  
  const canvas = myDiagram.makeImageData({
    scale: 2,
    background: "white"
  })
  
  const link = document.createElement('a')
  link.download = 'er-diagram.png'
  link.href = canvas
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onUnmounted(() => {
  if (myDiagram) {
    myDiagram.div = null
  }
})
</script>

<style scoped>
.diagram-container {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
}
</style> 