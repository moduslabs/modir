import React, { Context, Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { ViewState } from 'react-map-gl'
import Modite from '../models/Modite'

interface Viewport extends ViewState {
  modite?: Modite
}

export type ContextArray = [Viewport, Dispatch<SetStateAction<Viewport>>]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MapContext: Context<any> = createContext([{}, Function])

export const defaultViewport: Viewport = {
  latitude: -50,
  longitude: -40,
  zoom: 1,
  bearing: 0,
  pitch: 0,
}

const MapProvider = ({ children }: { children?: React.ReactNode }) => {
  const [viewport, setViewport] = useState({
    ...defaultViewport,
  })

  return <MapContext.Provider value={[viewport, setViewport]}>{children}</MapContext.Provider>
}

export default MapProvider

export const useMap = () => useContext(MapContext)
