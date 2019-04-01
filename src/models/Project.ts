import { ModiteProfile } from './Modite';

export default interface Project {
  name: string;
  id: string;
  localTime: string;
  localDate: string;
  tod: string;
  recordType: 'user' | 'project';
  users: {
    profile: ModiteProfile;
  };
}
