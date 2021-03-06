import { Dayjs } from 'dayjs'
import { Orm } from './orm'

export class Project extends Orm {
  id: number
  name: string
  identifier: string
  description: string
  status: number
  is_public: boolean
  parent: { id: number; name: string }
  created_on: Dayjs
  updated_on: Dayjs

  constructor(obj: any) {
    super()
    this.id = obj.id
    this.name = obj.name
    this.identifier = obj.identifier
    this.description = obj.description
    this.status = obj.status
    this.created_on = obj.created_on
    this.updated_on = obj.updated_on
    this.is_public = obj.is_public
    this.parent = obj.parent
  }

  static get className(): string {
    return 'Project'
  }

  getResourceClass() {
    return Project
  }
}
