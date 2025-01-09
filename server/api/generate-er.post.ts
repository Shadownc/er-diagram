import { parseSql } from '../utils/sql-parser'
import { TableInfo } from '~/types'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const tables = parseSql(body.sql)
    const erDiagram = generateErDiagram(tables)
    return { erDiagram }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : '生成ER图失败'
    })
  }
})

interface Relationship {
  from: string;
  to: string;
  name: string;
  cardinality: string;
}

function generateErDiagram(tables: TableInfo[]): string {
  const diagram = {
    // 实体
    entities: tables.map(table => ({
      key: table.name,
      name: table.name,
      category: "entity",
      color: "lightblue"
    })),
    
    // 属性
    attributes: tables.flatMap(table => 
      table.columns.map(column => ({
        key: `${table.name}_${column.name}`,
        name: column.name,
        entityKey: table.name,
        category: "attribute"
      }))
    ),
    
    // 关系
    relationships: tables.flatMap(table => 
      table.columns
        .filter(column => column.foreignKey)
        .map(column => ({
          key: `rel_${table.name}_${column.foreignKey?.table}`,
          name: column.name,
          from: table.name,
          to: column.foreignKey?.table || '',
          category: "relationship",
          fromCardinality: "1",
          toCardinality: "N"
        }))
    )
  }

  return JSON.stringify(diagram)
} 