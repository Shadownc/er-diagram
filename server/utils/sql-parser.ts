import { TableInfo, TableColumn } from '~/types'

export function parseSql(sql: string): TableInfo[] {
  const tables: TableInfo[] = []
  
  // 分割多个 CREATE TABLE 语句
  const createTableStatements = sql.split(/;/).filter(stmt => 
    stmt.trim().toLowerCase().startsWith('create table')
  )
  
  for (const statement of createTableStatements) {
    const table = parseCreateTable(statement)
    if (table) {
      tables.push(table)
    }
  }
  
  return tables
}

function parseCreateTable(sql: string): TableInfo | null {
  // 基本的正则表达式来匹配 CREATE TABLE 语句
  const tableNameMatch = sql.match(/create\s+table\s+`?(\w+)`?\s*\(/i)
  if (!tableNameMatch) return null
  
  const tableName = tableNameMatch[1]
  const columnDefinitions = sql
    .substring(sql.indexOf('(') + 1, sql.lastIndexOf(')'))
    .split(',')
    .map(col => col.trim())
    .filter(col => col && !col.toLowerCase().startsWith('primary key'))
  
  const columns: TableColumn[] = []
  
  for (const colDef of columnDefinitions) {
    const column = parseColumn(colDef)
    if (column) {
      columns.push(column)
    }
  }
  
  // 查找表注释
  const commentMatch = sql.match(/comment\s*=\s*'([^']*)'/)
  const tableComment = commentMatch ? commentMatch[1] : undefined
  
  return {
    name: tableName,
    comment: tableComment,
    columns
  }
}

function parseColumn(columnDef: string): TableColumn | null {
  // 匹配列定义：列名 类型 [其他属性] [COMMENT '注释']
  const match = columnDef.match(/`?(\w+)`?\s+(\w+)(?:\([^)]*\))?\s*([^']*(?:'[^']*')?)?/)
  if (!match) return null
  
  const [, name, type] = match
  
  // 提取注释
  const commentMatch = columnDef.match(/comment\s*'([^']*)'/)
  const comment = commentMatch ? commentMatch[1] : undefined
  
  // 判断是否可为空
  const isNullable = !columnDef.toLowerCase().includes('not null')
  
  // 判断是否主键
  const isPrimary = columnDef.toLowerCase().includes('primary key')
  
  return {
    name,
    type,
    comment,
    isPrimary,
    isNullable
  }
} 