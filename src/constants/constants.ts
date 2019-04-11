interface ViewTypes {
  project: 'project'
  projects: 'projects'
  modite: 'modite'
  modites: 'modites'
}
const VIEW_TYPES: ViewTypes = {
  project: 'project',
  projects: 'projects',
  modite: 'modite',
  modites: 'modites',
}

interface RecordTypes {
  project: 'project'
  user: 'user'
}
const RECORD_TYPES: RecordTypes = {
  project: 'project',
  user: 'user',
}

interface NameProperties {
  realName: 'real_name'
  name: 'name'
}
const NAME_PROPERTIES: NameProperties = {
  realName: 'real_name',
  name: 'name',
}

export { VIEW_TYPES, RECORD_TYPES, NAME_PROPERTIES }
