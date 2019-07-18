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
  addSpacerRow = false,
  lastScrollOffset = 0,
  onScroll,
  plain = false,
  records,
}) => {
  const dimensions: Dimensions = useWindowDimensions()
  const getItemSize = (index: number) => (addSpacerRow && index === 0 ? dimensions.height / 2 : 60)
  const localRecords = addSpacerRow ? [{ ...pseudoRecord }, ...records] : records

  const Renderer: FunctionComponent<ListChildComponentProps> = ({ index, style }) => (
    <Row plain={plain} addSpacerRow={addSpacerRow} modite={localRecords[index]} style={style} />
  )

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
