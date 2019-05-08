import * as React from "react";
import VirtualizedList from "../VirtualizedList";

const NoRecordsFound = () => {
  const moditeNotFound = {
    real_name: 'No modite found',
    tz: (Intl.DateTimeFormat().resolvedOptions().timeZone) // client timezone
  }

  const onScroll = (): void => {

  }

  return <VirtualizedList
    addSpacerRow={true}
    records={[moditeNotFound]}
    onScroll={onScroll}
    lastScrollOffset={0}
    />
}

export default NoRecordsFound
