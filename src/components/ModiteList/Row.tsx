import React, { CSSProperties, FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import Modite from '../../models/Modite'
import ModiteItem from './Item'
import s from './Row.module.css'

interface RowProps {
  addSpacerRow: boolean
  plain: boolean
  modite: Modite
  style: CSSProperties
}

const Row: FunctionComponent<RowProps> = ({ addSpacerRow, plain, modite, style }) =>
  addSpacerRow && modite.id === '-1' ? (
    <div style={style} />
  ) : (
    <Link to={`/details/${modite.id}`} className={s.moditeRow} style={style}>
      <ModiteItem plain={plain} key={modite.id} item={modite} />
    </Link>
  )

export default Row
