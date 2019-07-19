import React from 'react'
import ProjectList from '../../components/ProjectList'
import { ContextArray as DataContextArray, useData } from '../../service/Data'

interface Props {
  onScroll: (offset: number) => void
}

let lastScrollOffset = 0 // used by onListScroll

const Projects = ({ onScroll }: Props) => {
  const [state]: DataContextArray = useData()

  const onListScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
    lastScrollOffset = scrollOffset

    onScroll(scrollOffset)
  }

  return (
    <ProjectList
      addSpacerRow={true}
      records={state.projects}
      onScroll={onListScroll}
      lastScrollOffset={lastScrollOffset}
    />
  )
}

export default Projects
