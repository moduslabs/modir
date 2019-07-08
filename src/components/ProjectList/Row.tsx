import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { ListChildComponentProps } from 'react-window'
import ProjectItem from './Item'
import s from './Row.module.css'

interface RowProps extends ListChildComponentProps {
  addSpacerRow: boolean
  plain: boolean
}

const Row: FunctionComponent<RowProps> = ({ addSpacerRow, data, index, plain, style }) => (
  <>
    {addSpacerRow && index === 0 && <div style={style} />}
    <Link to={`/details/${data[index].id}`} className={s.moditeRow} style={style}>
      <ProjectItem plain={plain} key={data[index].id} item={data[index]} />
    </Link>
  </>
)

export default Row
