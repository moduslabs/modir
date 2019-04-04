import Modite from './Modite'
import Project from './Project'

interface WorkerData {
  modites: Modite[]
  projects: Project[]
}

export default interface WorkerEvent {
  data: WorkerData
}
