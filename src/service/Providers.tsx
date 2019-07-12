import React, { ReactNode } from 'react'
import DataProvider from './Data'
import GlobalProvider from './Global'
import MapProvider from './Map'

interface Props {
  children: ReactNode | ReactNode[]
}

const Providers = ({ children }: Props) => (
  <DataProvider>
    <GlobalProvider>
      <MapProvider>{children}</MapProvider>
    </GlobalProvider>
  </DataProvider>
)

export default Providers
