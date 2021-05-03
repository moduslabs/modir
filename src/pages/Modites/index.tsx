import React from 'react'
import GlobeModiteList from '../../components/GlobeModiteList'
import ModiteList from '../../components/ModiteList'
import NoResults from '../../components/NoResults'
import { ContextArray as DataContextArray, useData } from '../../service/Data'

interface Props {
  listType: 'globe' | 'list'
  onScroll: (offset: number) => void
}

let lastScrollOffset = 0 // used by onListScroll

const Modites = ({ listType, onScroll }: Props) => {
  const [{ modites }]: DataContextArray = useData()

  if (!modites.length) {
    return <NoResults />
  }

  switch (listType) {
    case 'list':
      const onListScroll = ({ scrollOffset }: { scrollOffset: number }): void => {
        lastScrollOffset = scrollOffset

        onScroll(scrollOffset)
      }

      return (
        <ModiteList addSpacerRow={true} records={modites} onScroll={onListScroll} lastScrollOffset={lastScrollOffset} />
      )
    default:
      return <GlobeModiteList />
  }
}

export default Modites
