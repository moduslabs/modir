export default interface IProject {
  name: string
  real_name?: string
  id: string
  localTime: string
  localDate: string
  tod: string
  recordType: 'user' | 'project'
  users: any
}
