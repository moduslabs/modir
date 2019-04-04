import IModite from './Modite'
import IProject from './Project'

interface IWorkerData {
  modites: IModite[]
  projects: IProject[]
}

export default interface IWorkerEvent {
  data: IWorkerData
}
