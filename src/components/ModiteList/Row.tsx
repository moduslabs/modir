import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import { ListChildComponentProps } from 'react-window'
import ModiteItem from './Item'
import s from './Row.module.css'

interface RowProps extends ListChildComponentProps {
  addSpacerRow: boolean
}

const Row: FunctionComponent<RowProps> = ({ addSpacerRow, data, index, style }) => (
  <>
    {addSpacerRow && index === 0 && <div style={style} />}
    {(!addSpacerRow || (addSpacerRow && index !== 0)) && data[index].id && (
      <Link to={`/details/${data[index].id}`} className={`ListRow ${s.moditeRow}`} style={style}>
        <ModiteItem key={data[index].id} item={data[index]} />
      </Link>
    )}
    {/* When does not have an id (e.g. no modite found) there is no detail link.*/}
    {(!addSpacerRow || (addSpacerRow && index !== 0)) && !data[index].id && (
      <span className={`ListRow ${s.moditeRow}`} style={style}>
        <ModiteItem key={data[index].id} item={data[index]} />
      </span>
    )}
  </>
)

export default Row
