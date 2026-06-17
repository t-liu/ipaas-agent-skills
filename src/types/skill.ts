export type UUID = string & { __brand: 'UUID' }
export type SemVer = string & { __brand: 'SemVer' }
export type KebabCase = string & { __brand: 'KebabCase' }
export type ISODate = string & { __brand: 'ISODate' }

export type SkillCategory = 'testing' | 'mapping' | 'design' | 'deployment' | 'automation'

export interface AgentSkill {
  id: UUID
  name: KebabCase
  displayName: string
  version: SemVer
  author: string
  description: string
  longDescription?: string
  tags: string[]
  category: SkillCategory
  downloads: number
  installationCmd: string
  createdAt: ISODate
  updatedAt: ISODate
}
