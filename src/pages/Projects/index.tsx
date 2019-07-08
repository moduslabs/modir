import React from 'react'
import ProjectList from '../../components/ProjectList'
import { useData } from '../../service/Data'
import { DataState } from '../../types/service/Data'

interface Props {
  onScroll?: (scrollOffset: number) => void
}

let lastScrollOffset = 0 // used by onScroll

const Projects = ({ onScroll }: Props) => {
  const [state]: [DataState] = useData()

  const onListScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
    lastScrollOffset = scrollOffset

    if (onScroll) {
      onScroll(scrollOffset)
    }
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
