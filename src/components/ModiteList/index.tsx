import React, { FunctionComponent } from 'react'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import Modite from '../../models/Modite'
import ModiteListProps from '../../types/components/ModiteList'
import Row from './Row'

// used for spacer row
const pseudoRecord: Modite = {
  id: '-1',
}

const ModiteList: FunctionComponent<ModiteListProps> = ({
  addSpacerRow = false,
  className,
  lastScrollOffset = 0,
  onScroll,
  plain = false,
  records,
}) => {
  const getItemSize = (index: number) => (addSpacerRow && index === 0 ? document.body.clientHeight / 2 : 60)
  const localRecords = addSpacerRow ? [{ ...pseudoRecord }, ...records] : records

  const Renderer: FunctionComponent<ListChildComponentProps> = ({ index, style }) => (
    <Row plain={plain} addSpacerRow={addSpacerRow} modite={localRecords[index]} style={style} />
  )

  return (
    <AutoSizer className={className} aria-label="The list of Modites">
      {({ height, width }: { height: number; width: number }) => (
        <>
          <List
            itemSize={getItemSize}
            itemCount={localRecords.length}
            height={height}
            width={width}
            initialScrollOffset={lastScrollOffset}
            onScroll={onScroll}
            itemKey={(index: number) => localRecords[index].id || (index.toString() as string)}
            overscanCount={250}
          >
            {Renderer}
          </List>
        </>
      )}
    </AutoSizer>
  )
}

export default React.memo(ModiteList)
