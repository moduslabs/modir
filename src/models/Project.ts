import { RecordTypes, ModiteProfile } from './Modite'

export default interface Project {
  name: string
  real_name?: string
  id: string
  localTime?: string
  localDate?: string
  tod?: string
  recordType: RecordTypes
  users: any
  profile?: ModiteProfile
}
