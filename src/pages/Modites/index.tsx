import React from 'react'
import GlobeModiteList from '../../components/GlobeModiteList'
import ModiteList from '../../components/ModiteList'
import { useData } from '../../service/Data'
import { DataState } from '../../types/service/Data'

interface Props {
  listType: 'globe' | 'list'
  onScroll?: (scrollOffset: number) => void
}

let lastScrollOffset = 0 // used by onScroll

const Modites = ({ listType, onScroll }: Props) => {
  const [state]: [DataState] = useData()

  if (listType === 'list') {
    const onListScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
      lastScrollOffset = scrollOffset

      if (onScroll) {
        onScroll(scrollOffset)
      }
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
