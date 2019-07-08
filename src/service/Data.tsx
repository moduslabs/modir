import React, { Context, createContext, useContext, useEffect, Dispatch } from 'react'
import get from 'lodash-es/get'
import Modite, { ListTypes, ModiteProfile } from '../models/Modite'
import Project from '../models/Project'
import { VIEW_TYPES, NAME_PROPERTIES } from '../constants/constants'
import { DataState, DataAction, DataProps } from '../types/service/Data'
import { envOrDefault } from '../utils/env'

const MODITES_URL = envOrDefault('REACT_APP_MODITES_DATA_URL') as string
const PROJECTS_URL = envOrDefault('REACT_APP_PROJECTS_DATA_URL') as string
const MODITE_URL = envOrDefault('REACT_APP_MODITE_DATA_URL') as string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataContext: Context<any> = createContext([{}, Function])

let rawModites: Modite[] = []
let rawProjects: Project[] = []

// Find the last name either by the last name prop or splitting real_name
// If nothing is found, push it to the bottom (~ comes after Z)
const getLastName = (modite: Modite): string => {
  let lastName = get(modite, 'profile.last_name', false)
  if (!lastName) {
    lastName = get(modite, `real_name`, ' ~')
  }
  return (lastName.split(' ') || ['~']).slice(-1)[0]
}

const sortRecords = (records: (Modite | Project)[]): void => {
  if (records.length) {
    records.sort((prev: Modite | Project, next: Modite | Project) => {
      const prevName = getLastName(prev).toLowerCase()
      const nextName = getLastName(next).toLowerCase()
      if (prevName < nextName) return -1
      if (prevName > nextName) return 1
      return 0
    })
  }
}

let moditeMap: { [key: string]: Modite } = {}

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
    ? (records as (Modite | Project)[]).filter(
        item =>
          fieldGetter(item)
            .toLowerCase()
            .indexOf(filterLowered) > -1,
      )
    : records
}
const filterModites = (filter: string): Modite[] => {
  return filterRecords({ records: [...rawModites], type: VIEW_TYPES.modites, filter })
}
const filterProjects = (filter: string): Project[] =>
  filterRecords({ records: [...rawProjects], type: VIEW_TYPES.projects, filter }) as Project[]

function monthDayYear(date: Date): string {
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

const processTimestamps = (records: Modite[] = []) => {
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
}

const processRecords = (
  filter: string,
): {
  modites: Modite[]
  projects: Project[]
} => {
  const modites: Modite[] = filterModites(filter)
  const projects: Project[] = filterProjects(filter)
  processTimestamps(modites)

  return { modites, projects }
}

const reducer = (state: DataState, action: DataAction): DataState => {
  let processed: { modites: Modite[]; projects: Project[] }

  switch (action.type) {
    case 'on-fetch-modite-profile':
      return {
        ...state,
      }
    case 'on-filter':
      processed = processRecords(action.filter as string)
      return {
        filter: action.filter as string,
        modites: processed.modites,
        projects: processed.projects,
        rawModites,
        rawProjects,
      }
    case 'on-load':
      processed = processRecords(state.filter)
      return {
        ...state,
        modites: processed.modites,
        projects: processed.projects,
        rawModites,
        rawProjects,
      }
    default:
      throw new Error()
  }
}

const initialState: DataState = {
  filter: '',
  modites: [],
  projects: [],
  rawModites: [],
  rawProjects: [],
}

const getHeaders = () =>
  new Headers({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  })

// adds complete modite records to the rawProjects records' user property
const augmentProjectUsers = (): void => {
  rawProjects.forEach((project: Project) => {
    project.profile = {
      last_name: project.name,
    }
    project.users = project.users.map((modite: Modite) => moditeMap[modite.id as string])
    project.users = project.users.filter(Boolean)
  })
}

// @ts-ignore
const signOut = () => gapi.auth2.getAuthInstance().signOut()

const DataProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch]: [DataState, Dispatch<DataAction>] = React.useReducer(reducer, initialState)

  const getData = async (): Promise<void> => {
    const [modites, projects]: [Modite[], Project[]] = await Promise.all([
      fetch(MODITES_URL, { headers: getHeaders() }).then(res => res.json()),
      fetch(PROJECTS_URL, { headers: getHeaders() }).then(res => res.json()),
    ]).catch(signOut)

    rawModites = modites
    rawProjects = projects
    rawProjects.forEach((project: Project) => {
      if (project.users) sortRecords(project.users)
    })

    if (!Object.keys(moditeMap).length) {
      rawModites.forEach((modite: Modite) => (moditeMap[modite.id as string] = modite))
      augmentProjectUsers()
    }

    sortRecords(rawModites)
    sortRecords(rawProjects)

    dispatch({ type: 'on-load' })
  }

  const props: DataProps = {
    setFilter: (filter: string) => {
      dispatch({
        type: 'on-filter',
        filter,
      })
    },
    processTimestamps,
    fetchModiteProfile: (id: string) => {
      const suffix: string = MODITE_URL.includes('.json') ? '' : id
      const url = `${MODITE_URL}${suffix}`

      fetch(url, { headers: getHeaders() })
        .then(res => res.json())
        .then(json => {
          const { ok, profile }: { ok: boolean; profile: ModiteProfile } = json

          if (ok && profile) {
            const rawTarget: Modite = rawModites.find((modite: Modite) => modite.id === id) as Modite
            if (rawTarget) {
              rawTarget.profile = profile
            }
            const mappedTarget: Modite = moditeMap[id]
            if (mappedTarget) {
              mappedTarget.profile = profile
              augmentProjectUsers()
              dispatch({ type: 'on-fetch-modite-profile' })
            }
          }
        })
        .catch(signOut)
      // https://modus.app/modite/U0AUTJZUL
      // fetch(MODITE_URL, { headers }).then(res => res.json())
      // dispatch({
      //   type: 'on-fetch-modite-profile',
      //   id,
      // })
    },
  }

  useEffect((): void => {
    getData()
  }, [])

  return <DataContext.Provider value={[state, props]}>{children}</DataContext.Provider>
}

export { DataProvider }
export default DataContext

export const useData = () => useContext(DataContext)
