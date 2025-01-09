export interface TableColumn {
  name: string
  type: string
  comment?: string
  isPrimary?: boolean
  isNullable?: boolean
}

export interface TableInfo {
  name: string
  comment?: string
  columns: TableColumn[]
}

export interface ErDiagramData {
  tables: TableInfo[]
  relationships: string[]
} 