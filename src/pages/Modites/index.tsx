import React, { useEffect } from 'react'
import GlobeModiteList from '../../components/GlobeModiteList'
import ModiteList from '../../components/ModiteList'
import { useData } from '../../service/Data'
import { DataState } from '../../types/service/Data'
import { ContextArray as GlobalContextArray, useGlobal } from '../../service/Global'
import { ContextArray as MapContextArray, defaultViewport, useMap } from '../../service/Map'

interface Props {
  listType: 'globe' | 'list'
}

let lastScrollOffset = 0 // used by onScroll

const Modites = ({ listType }: Props) => {
  const [state]: [DataState] = useData()
  const [globalState, setGlobalState]: GlobalContextArray = useGlobal()
  const [, setViewport]: MapContextArray = useMap()

  useEffect(() => {
    setGlobalState({
      ...globalState,
      headerHidden: false,
      searchBarHidden: false,
    })
  }, [])

  if (listType === 'list') {
    const onListScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
      lastScrollOffset = scrollOffset

      setGlobalState({
        ...globalState,
        searchBarCollapsed: scrollOffset >= document.body.clientHeight / 5,
      })

      setViewport({
        ...defaultViewport,
      })
    }

    return (
      <ModiteList
        addSpacerRow={true}
        records={state.modites}
        onScroll={onListScroll}
        lastScrollOffset={lastScrollOffset}
      />
    )
  } else {
    return <GlobeModiteList />
  }
}

export default Modites
