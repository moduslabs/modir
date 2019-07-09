import React, { CSSProperties, FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import Project from '../../models/Project'
import ProjectItem from './Item'
import s from './Row.module.css'

interface RowProps {
  addSpacerRow: boolean
  plain: boolean
  project: Project
  style: CSSProperties
}

const Row: FunctionComponent<RowProps> = ({ addSpacerRow, plain, project, style }) =>
  addSpacerRow && project.id === '-1' ? (
    <div style={style} />
  ) : (
    <Link to={`/details/${project.id}`} className={s.moditeRow} style={style}>
      <ProjectItem plain={plain} key={project.id} item={project} />
    </Link>
  )

export default Row
