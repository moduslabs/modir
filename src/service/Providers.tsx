import React, { ReactNode } from 'react'
import DataProvider from './Data'
import GlobalProvider from './Global'
import MapProvider from './Map'
import WindowDimensionsProvider from './WindowDimensions'

interface Props {
  children: ReactNode | ReactNode[]
}

const Providers = ({ children }: Props) => (
  <WindowDimensionsProvider>
    <DataProvider>
      <GlobalProvider>
        <MapProvider>{children}</MapProvider>
      </GlobalProvider>
    </DataProvider>
  </WindowDimensionsProvider>
)

export default Providers
