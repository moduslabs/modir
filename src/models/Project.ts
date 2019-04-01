import { IModiteProfile } from './Modite';

export default interface IProject {
  name: string;
  id: string;
  localTime: string;
  localDate: string;
  tod: string;
  recordType: 'user' | 'project';
  users: {
    profile: IModiteProfile;
  };
}
