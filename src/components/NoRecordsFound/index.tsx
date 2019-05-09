import React from 'react'
import VirtualizedList from '../VirtualizedList'

const NoRecordsFound = () => {
  const moditeNotFound = {
    real_name: 'No modite found',
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone, // client timezone
  }

  return <VirtualizedList addSpacerRow={true} records={[moditeNotFound]} onScroll={() => {}} lastScrollOffset={0} />
}

export default NoRecordsFound
