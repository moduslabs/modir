import profilePlaceholder from '../assets/images/modus-neon.gif';

export interface ModiteProfile {
  title: string;
  last_name: string;
  phone: string;
  email: string;
  image_72: string;
  image_192: string;
  image_512: string;
  fields: { [key: string]: any };
}

export default interface Modite {
  real_name: string;
  name: string;
  id: string;
  tz: string;
  tz_offset: number;
  color: string;
  localTime: string;
  localDate: string;
  tod: string;
  profile: ModiteProfile;
}

export const defaultModite: Modite = {
  profile: {
    image_192: profilePlaceholder,
    fields: {}
  }
} as Modite;
