export interface LocationData {
  place_id?: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: string[]
  lat: number
  lon: number
  display_name?: string
  class?: string
  type?: string
  importance?: number
  icon?: string
}

export interface ModiteProfile {
  title?: string
  phone?: string
  skype?: string
  real_name?: string
  real_name_normalized?: string
  display_name?: string
  display_name_normalized?: string
  fields: {
    'Skype User'?: string
    'Name Pronunciation'?: string
    'Start Date'?: string
    Location?: string
    'Current Project'?: string
    Position?: string
    Bio?: string
    Bday?: string
    'Preferred Pronoun'?: string
    locationData?: LocationData
    'GitHub User'?: string
  }
  status_text?: string
  status_emoji?: string
  status_expiration?: number
  avatar_hash?: string
  image_original?: string
  is_custom_image?: boolean
  email?: string
  first_name?: string
  last_name?: string
  image_24: string
  image_32: string
  image_48: string
  image_72: string
  image_192: string
  image_512: string
  image_1024: string
  status_text_canonical?: string
}

export type RecordTypes = 'user' | 'project'
export type ListTypes = 'projects' | 'modites'

export default interface Modite {
  real_name?: string
  name?: string
  id: string
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
  fields?: string
}
