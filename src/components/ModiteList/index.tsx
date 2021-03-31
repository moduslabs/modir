import React, { FunctionComponent } from 'react'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'
import Modite from '../../models/Modite'
import { Dimensions, useWindowDimensions } from '../../service/WindowDimensions'
import ModiteListProps from '../../types/components/ModiteList'
import Row from './Row'

// used for spacer row
const pseudoRecord: Modite = {
  id: '-1',
}

const ModiteList: FunctionComponent<ModiteListProps> = ({
  listType = 'list',
  addSpacerRow = false,
  lastScrollOffset = 0,
  onScroll,
  plain = false,
  records,
}) => {
  const dimensions: Dimensions = useWindowDimensions()
  const getItemSize = (index: number) => (addSpacerRow && index === 0 ? dimensions.height / 2 : 60)
  const options = JSON.parse(localStorage.getItem("list-options")) || {
    view: "list",
    sort: "lasta",
  }
  const sortBy = options.sort

  const Renderer: FunctionComponent<ListChildComponentProps> = ({ index, style }) => (
    <Row plain={plain} addSpacerRow={addSpacerRow} modite={localRecords[index]} style={style} />
  )

  let sort_records = [...records]
  switch (sortBy) {
    case "lasta":
      break
    case "lastd":
      sort_records = sort_records.reverse()
      break
    case "firsta":
      sort_records.sort((a, b) => {
        const aFirst = a.real_name.split(' ').shift(),
          bFirst = b.real_name.split(' ').shift()
        return aFirst.localeCompare(bFirst)
      })
      break
    case "firstd":
      sort_records.sort((a, b) => {
        const aFirst = a.real_name.split(' ').shift(),
          bFirst = b.real_name.split(' ').shift()
        return bFirst.localeCompare(aFirst)
      })
      break
    case "tacosa":
      sort_records.sort((a, b) => {
        return a.tacos - a.tacos
      })
      break
    case "tacosd":
      sort_records.sort((a, b) => {
        return b.tacos - a.tacos
      })
      break
    case "timea":
      sort_records.sort((a, b) => {
        return a.tz_offset - b.tz_offset
      })
      break
    case "timed":
      sort_records.sort((a, b) => {
        return b.tz_offset - a.tz_offset
      })
      break;
  }

//  console.log("records", records)
  const localRecords = addSpacerRow ? [{ ...pseudoRecord }, ...sort_records] : sort_records

  return (
    <List
      itemSize={getItemSize}
      itemCount={localRecords.length}
      height={dimensions.height - 43}
      width={dimensions.width}
      initialScrollOffset={lastScrollOffset}
      onScroll={onScroll}
      itemKey={(index: number) => localRecords[index].id}
      overscanCount={20}
    >
      {Renderer}
    </List>
  )
}

export default React.memo(ModiteList)
