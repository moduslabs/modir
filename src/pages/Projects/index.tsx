import React, { useEffect } from 'react'
import ProjectList from '../../components/ProjectList'
import { ContextArray as DataContextArray, useData } from '../../service/Data'
import { ContextArray as GlobalContextArray, useGlobal } from '../../service/Global'

let lastScrollOffset = 0 // used by onScroll

const Projects = () => {
  const [state]: DataContextArray = useData()
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
      searchBarCollapsed: scrollOffset >= Math.min(100, document.body.clientHeight / 6),
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
