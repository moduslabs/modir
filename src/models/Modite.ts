import profilePlaceholder from '../assets/images/modus-neon.gif'

export interface ModiteProfile {
  title?: string
  last_name?: string
  real_name?: string
  real_name_normalized?: string
  display_name?: string
  display_name_normalized?: string
  status_text?: string
  status_emoji?: string
  status_expiration?: number
  status_text_canonical?: string
  avatar_hash?: string
  first_name?: string
  phone?: string
  email?: string
  skype?: string
  image_24?: string
  image_32?: string
  image_48?: string
  image_72?: string
  image_192: string
  image_512?: string
  fields?: { [key: string]: any }
}

export type RecordTypes = 'user' | 'project'
export type ListTypes = 'projects' | 'modites'

export default interface Modite {
  real_name?: string
  name?: string
  id?: string
  team_id?: string
  deleted?: boolean
  tz?: string
  tz_label?: string
  tz_offset?: number
  color?: string
  localTime?: string
  localDate?: string
  tod?: string
  profile?: ModiteProfile
  tacos?: number
  recordType?: RecordTypes
  is_admin?: boolean
  is_owner?: boolean
  is_primary_owner?: boolean
  is_restricted?: boolean
  is_ultra_restricted?: boolean
  is_bot?: boolean
  is_app_user?: boolean
  updated?: number
}

export const defaultModite: Modite = {
  profile: {
    fields: {},
    // eslint-disable-next-line @typescript-eslint/camelcase
    image_192: profilePlaceholder,
  },
}
