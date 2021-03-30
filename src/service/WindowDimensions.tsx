import React, { createContext, useContext, useState, useEffect } from 'react'

interface Props {
  children: React.ReactNode
}

export type Orientation = 'landscape' | 'portrait'

export interface Dimensions {
  height: number
  orientation: Orientation
  width: number
}

const WindowDimensionsContext = createContext<Dimensions>({
  height: 0,
  orientation: 'portrait',
  width: 0,
})

const getOrientation = (height: number, width: number): Orientation => (height > width ? 'portrait' : 'landscape')

const WindowDimensionsProvider = ({ children }: Props) => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: window.innerWidth,
    orientation: getOrientation(window.innerHeight, window.innerWidth),
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () =>
      setDimensions({
        width: window.innerWidth,
        orientation: getOrientation(window.innerHeight, window.innerWidth),
        height: window.innerHeight,
      })

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <WindowDimensionsContext.Provider value={dimensions}>{children}</WindowDimensionsContext.Provider>
}

export default WindowDimensionsProvider

export const useWindowDimensions = () => useContext(WindowDimensionsContext)
