import React, { FunctionComponent } from 'react'
import { VariableSizeList as List, ListChildComponentProps } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import Project from '../../models/Project'
import ProjectListProps from '../../types/components/ProjectList'
import Row from './Row'

// used for spacer row
const pseudoRecord: Project = {
  id: '-1',
}

const ProjectList: FunctionComponent<ProjectListProps> = ({
  addSpacerRow = false,
  lastScrollOffset = 0,
  onScroll,
  plain = false,
  records,
}) => {
  const getItemSize = (index: number) => (addSpacerRow && index === 0 ? document.body.clientHeight / 2 : 60)
  const localRecords = addSpacerRow ? [{ ...pseudoRecord }, ...records] : records

  const Renderer: FunctionComponent<ListChildComponentProps> = ({ index, style }) => (
    <Row plain={plain} addSpacerRow={addSpacerRow} index={index} data={localRecords} style={style} />
  )

  return (
    <AutoSizer aria-label="The list of projects">
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
            overscanCount={200}
          >
            {Renderer}
          </List>
        </>
      )}
    </AutoSizer>
  )
}

export default React.memo(ProjectList)
