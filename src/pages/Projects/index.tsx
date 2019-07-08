import React, { useEffect } from 'react'
import ProjectList from '../../components/ProjectList'
import { useData } from '../../service/Data'
import { ContextArray as GlobalContextArray, useGlobal } from '../../service/Global'
import { DataState } from '../../types/service/Data'

let lastScrollOffset = 0 // used by onScroll

const Projects = () => {
  const [state]: [DataState] = useData()
  const [globalState, setGlobalState]: GlobalContextArray = useGlobal()

  useEffect(() => {
    setGlobalState({
      ...globalState,
      headerHidden: false,
      searchBarHidden: false,
    })
  }, [])

  const onListScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
    lastScrollOffset = scrollOffset

    setGlobalState({
      ...globalState,
      searchBarCollapsed: scrollOffset >= document.body.clientHeight / 5,
    })
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
