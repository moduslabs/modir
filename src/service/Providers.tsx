import React, { ReactNode } from 'react'
import DataProvider from './Data'
import MapProvider from './Map'
import WindowDimensionsProvider from './WindowDimensions'

interface Props {
  children: ReactNode | ReactNode[]
}

const Providers = ({ children }: Props) => (
  <WindowDimensionsProvider>
    <DataProvider>
      <MapProvider>{children}</MapProvider>
    </DataProvider>
  </WindowDimensionsProvider>
)

export default Providers
