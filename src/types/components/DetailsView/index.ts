import Modite from '../../../models/Modite'
import Project from '../../../models/Project'

export interface GitHubProps {
  className?: string
  name?: string
}

export interface ModiteDetailProps {
  className?: string
  modite?: Modite | null
}

export interface ProjectDetailProps {
  className?: string
  project?: Project | null
}

export interface DetailsViewProps {
  record: Modite | Project | undefined
  className?: string
}
