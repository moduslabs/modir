import React, { Context, Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import get from 'lodash-es/get'
import Modite, { ListTypes } from '../models/Modite'
import Project from '../models/Project'
import { VIEW_TYPES, NAME_PROPERTIES } from '../constants/constants'
import { DataState, DataAction } from '../types/service/Data'
import { envOrDefault } from '../utils/env'
import { ModiteProfile } from '../models/Modite'
import { ModiteProfile as ModiteProfileDefault } from '../defaults/modite'
const MODITES_URL = envOrDefault('REACT_APP_MODITES_DATA_URL') as string
const MODITE_URL = envOrDefault('REACT_APP_MODITE_DATA_URL') as string
const PROJECTS_URL = envOrDefault('REACT_APP_PROJECTS_DATA_URL') as string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DataContext: Context<any> = createContext([{}, Function])

export type ContextArray = [DataState, Dispatch<SetStateAction<DataAction>>]

let rawModites: Modite[] = []
let rawProjects: Project[] = []
const moditeMap: { [key: string]: Modite } = {}

// Find the last name either by the last name prop or splitting real_name
// If nothing is found, push it to the bottom (~ comes after Z)
const getLastName = (modite: Modite): string => {
  let lastName = get(modite, 'profile.last_name', false)

  if (!lastName) {
    lastName = get(modite, `real_name`, ' ~')
  }

  return (lastName.split(' ') || ['~']).slice(-1)[0]
}

const sortModites = (records: Modite[]): void => {
  if (records.length) {
    records.sort((prev: Modite, next: Modite) => {
      const prevName = getLastName(prev).toLowerCase()
      const nextName = getLastName(next).toLowerCase()

      if (prevName < nextName) return -1
      if (prevName > nextName) return 1

      return 0
    })
  }
}

const sortProjects = (records: Project[]): void => {
  if (records.length) {
    records.sort((prev: Project, next: Project): -1 | 0 | 1 => {
      const prevName = prev.name.toLowerCase()
      const nextName = next.name.toLowerCase()

      if (prevName < nextName) return -1
      if (prevName > nextName) return 1

      return 0
    })
  }
}

const filterRecords = ({
  records,
  type,
  filter = '',
}: {
  records: (Modite | Project)[]
  type: ListTypes
  filter?: string
}): (Modite | Project)[] => {
  const filterLowered: string = filter.toLowerCase()
  const fieldGetter = (item: Modite | Project) => {
    const isModite = type === VIEW_TYPES.modites

    if (isModite) {
      return String(item[NAME_PROPERTIES.realName]).concat(
        get(item, 'profile.display_name', ''),
        get(item, 'profile.fields.Title', ''),
        get(item, 'profile.fields.Location', ''),
        get(item, `profile.fields['Current Project']`, ''),
        get(item, `profile.fields['Short Bio']`, ''),
        get(item, 'profile.fields.locationData.display_name', ''),
      )
    }

    return String(item[NAME_PROPERTIES.name])
  }

  return filter.trim().length
    ? (records as (Modite | Project)[]).filter((item) => fieldGetter(item).toLowerCase().indexOf(filterLowered) > -1)
    : records
}
const filterModites = (filter: string): Modite[] =>
  filterRecords({ records: rawModites.slice(), type: VIEW_TYPES.modites, filter })

const filterProjects = (filter: string): Project[] =>
  filterRecords({ records: rawProjects.slice(), type: VIEW_TYPES.projects, filter }) as Project[]

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function monthDayYear(date: Date): string {
  const month: string = months[date.getMonth()]
  const day: number = date.getDate()
  const year: number = date.getFullYear()

  return `${month} ${day}, ${year}`
}

export function formatAMPM(date: Date): [string, boolean] {
  let hours: number = date.getHours()
  let minutes: number | string = date.getMinutes()

  const isAfterNoon = hours >= 12
  const ampm: string = isAfterNoon ? 'pm' : 'am'

  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'

  minutes = minutes < 10 ? '0' + minutes : minutes

  return [`${hours}:${minutes} ${ampm}`, isAfterNoon]
}

const processTimestamps = (records: Modite[] = []): Modite[] => {
  const now = new Date()
  const utc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds(),
  )

  records.forEach((item: Modite) => {
    const itemDate = new Date(utc + (item.tz_offset as number))

    item.localDate = monthDayYear(itemDate)
  })

  return records
}

const reducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case 'clear-filter':
      return {
        ...state,
        moditesFilter: undefined,
        modites: rawModites.slice(),
        projectsFilter: undefined,
        projects: rawProjects.slice(),
      }
    case 'filter-modites':
      return {
        ...state,
        moditesFilter: action.filter as string,
        modites: processTimestamps(filterModites(action.filter as string)),
      }
    case 'filter-project-users':
      return {
        ...state,
        modites: action.modites || [],
      }
    case 'filter-projects':
      return {
        ...state,
        projectsFilter: action.filter as string,
        projects: filterProjects(action.filter as string),
      }
    case 'on-load':
      return {
        ...state,
        isLoaded: true,
        modites: processTimestamps([...rawModites]),
        projects: rawProjects.slice(),
      }
    default:
      throw new Error()
  }
}

const initialState: DataState = {
  filter: '',
  isLoaded: false,
  modites: [],
  projects: [],
}

const getHeaders = () =>
  new Headers({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  })

// adds complete modite records to the rawProjects records' user property
const augmentProjectUsers = (): void => {
  rawProjects.forEach((project: Project) => {
    project.users = project.users.map((modite: Modite) => moditeMap[modite.id as string]).filter(Boolean)
  })
}

// @ts-ignore
const signOut = () => gapi.auth2.getAuthInstance().signOut()

const DataProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch]: [DataState, Dispatch<DataAction>] = React.useReducer(reducer, initialState)

  const getData = async (): Promise<void> => {
    const [modites, projects]: [Modite[], Project[]] = await Promise.all([
      fetch(MODITES_URL, { headers: getHeaders() }).then((res) => res.json()),
      fetch(PROJECTS_URL, { headers: getHeaders() }).then((res) => res.json()),
    ]).catch(signOut)

    rawModites = modites
    rawProjects = projects

    rawProjects.forEach((project: Project) => {
      if (project.users) {
        sortModites(project.users)
      }
    })

    if (!Object.keys(moditeMap).length) {
      rawModites.forEach((modite: Modite) => (moditeMap[modite.id as string] = modite))

      augmentProjectUsers()
    }

    sortModites(rawModites)
    sortProjects(rawProjects)

    dispatch({ type: 'on-load' })
  }

  useEffect((): void => {
    getData()
  }, [])

  return <DataContext.Provider value={[state, dispatch]}>{children}</DataContext.Provider>
}

export default DataProvider

export const useData = () => useContext(DataContext)

interface GetModiteData {
  moditeData: ModiteProfile
  isLoading: boolean
}
export const getModiteData = (slackId: string): GetModiteData => {
  const [moditeData, setModiteData] = useState<ModiteProfile>(ModiteProfileDefault)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const url = process.env.NODE_ENV === 'development' ? MODITE_URL : `${MODITE_URL}/${slackId}`
      await Promise.resolve(
        fetch(url, {
          headers: getHeaders(),
        }).then((res) => res.json()),
      )
        .then((modite) => {
          setModiteData(modite.profile)
          setIsLoading(false)
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log('error', e)
        })

      // eslint-disable-next-line no-console
      console.log('mod', moditeData)
    }

    getData()
  }, [])

  return { moditeData, isLoading }
}
