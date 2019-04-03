import React, { FunctionComponent } from 'react'
import { FixedSizeList as List, ListChildComponentProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Link } from 'react-router-dom'
import ModiteListItem from '../ModiteListItem'
import s from './styles.module.css'

// TODO: type correctly
const VirtualizedList: FunctionComponent<any> = ({ records, lastScrollOffset, onScroll = () => {} }) => {
  const Row = ({ index, style }: ListChildComponentProps) => (
    <Link to={`/details/${records[index].id}`} className={s.moditeRow} style={style}>
      <ModiteListItem modite={records[index]} key={records[index].id} />
    </Link>
  )

  return (
    <AutoSizer aria-label="The list of Modites">
      {({ height, width }: { height: number; width: number }) => (
        <>
          <List
            className="List"
            itemSize={60}
            itemCount={(records && records.length) || 10}
            height={height}
            width={width}
            initialScrollOffset={lastScrollOffset}
            onScroll={onScroll}
            itemKey={(index: number) => records[index].id || (index.toString() as string)}
            overscanCount={30}
          >
            {Row}
          </List>
        </>
      )}
    </AutoSizer>
  )
}

export default VirtualizedList
