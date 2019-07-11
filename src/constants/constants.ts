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

type LocationViewTypeMap = {
  [key in string]: ViewTypes
}

const LOCATION_VIEW_TYPE_MAP: LocationViewTypeMap = {
  modite: 'modite',
  modites: 'modites',
  project: 'project',
  projects: 'projects',
}

export const locationToViewType = (pathname: string): ViewTypes => {
  const [, match] = pathname.split('/')

  if (match) {
    return LOCATION_VIEW_TYPE_MAP[match as ViewTypes] || 'modites'
  }

  return 'modites'
}
