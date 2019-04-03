import profilePlaceholder from '../assets/images/modus-neon.gif'

export interface IModiteProfile {
  title?: string
  last_name?: string
  phone?: string
  email?: string
  image_24?: string
  image_32?: string
  image_72?: string
  image_192: string
  image_512?: string
  fields: { [key: string]: any }
}

export default interface IModite {
  real_name?: string
  name?: string
  id: string
  tz?: string
  tz_offset?: number
  color?: string
  localTime?: string
  localDate?: string
  tod?: string
  profile: IModiteProfile
  tacos?: number
  recordType?: 'user' | 'project'
}

export const defaultModite: IModite = {
  id: '',
  profile: {
    fields: {},
    image_192: profilePlaceholder,
  },
}
