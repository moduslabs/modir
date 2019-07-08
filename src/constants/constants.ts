export interface NameProperties {
  realName: 'real_name'
  name: 'name'
}

export interface RecordTypes {
  project: 'project'
  user: 'user'
}

export type ViewTypes = 'project' | 'projects' | 'modite' | 'modites'

export interface ViewTypesInterface {
  project: 'project'
  projects: 'projects'
  modite: 'modite'
  modites: 'modites'
}

export const VIEW_TYPES: ViewTypesInterface = {
  project: 'project',
  projects: 'projects',
  modite: 'modite',
  modites: 'modites',
}

export const RECORD_TYPES: RecordTypes = {
  project: 'project',
  user: 'user',
}

export const NAME_PROPERTIES: NameProperties = {
  realName: 'real_name',
  name: 'name',
}

const pathRe = /^\/(.*)\/?/

export const locationToViewType = (pathname: string): ViewTypes => {
  const matches = pathname.match(pathRe)

  if (matches && matches[1]) {
    return matches[1] as ViewTypes
  }

  return 'modites'
}
