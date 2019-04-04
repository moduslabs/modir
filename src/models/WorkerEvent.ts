import IModite from './Modite'
import IProject from './Project'

export interface IWorkerEventData {
  allModites: IModite[]
  filteredModites: IModite[]
  allProjects: IProject[]
  filteredProjects: IProject[]
}

export default interface IWorkerEvent {
  data: IWorkerEventData
}
