import React, { ReactNode } from 'react'
import { DataProvider } from './Data'
import MapProvider from './Map'

interface Props {
  children: ReactNode | ReactNode[]
}

const Providers = ({ children }: Props) => (
  <DataProvider>
    <MapProvider>{children}</MapProvider>
  </DataProvider>
)

export default Providers
