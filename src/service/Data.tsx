import React, { Context, createContext, useEffect, Dispatch } from 'react'
import Modite, { ListTypes, ModiteProfile } from '../models/Modite'
import Project from '../models/Project'
import { VIEW_TYPES, NAME_PROPERTIES } from '../constants/constants'
import { NameProperties, DataState, DataAction, DataProps } from '../types/service/Data'
import { envOrDefault } from '../utils/env'

const MODITES_URL = envOrDefault('REACT_APP_MODITES_DATA_URL') as string
const PROJECTS_URL = envOrDefault('REACT_APP_PROJECTS_DATA_URL') as string
const MODITE_URL = envOrDefault('REACT_APP_MODITE_DATA_URL') as string
const CLOUDFLARE_ID = envOrDefault('REACT_APP_CLOUDFLARE_ID') as string
const CLOUDFLARE_SECRET = envOrDefault('REACT_APP_CLOUDFLARE_SECRET') as string

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataContext: Context<any> = createContext([{}, Function])

let rawModites: Modite[] = []
let rawProjects: Project[] = []

const sortRecords = (records: (Modite | Project)[]): void => {
  if (records.length) {
    records.sort((prev: Modite | Project, next: Modite | Project) => {
      const prevName: string | undefined = (prev.profile as ModiteProfile).last_name || ''
      const nextName: string | undefined = (next.profile as ModiteProfile).last_name || ''

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
  const name: NameProperties = type === VIEW_TYPES.modites ? NAME_PROPERTIES.realName : NAME_PROPERTIES.name

  return filter.length
    ? (records as (Modite | Project)[]).filter(item => (item[name] as string).toLowerCase().indexOf(filterLowered) > -1)
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

function formatAMPM(date: Date): string {
  let hours: number = date.getHours()
  let minutes: number | string = date.getMinutes()
  const ampm: string = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  return `${hours}:${minutes} ${ampm}`
}

const processTimestamps = (records: Modite[] = [], date: Date) => {
  const nowUtc: Date = new Date(date.getTime() + date.getTimezoneOffset())

  records.forEach((item: Modite) => {
    const itemDate: Date = new Date((nowUtc as any) - (item.tz_offset as number) * 60000)
    const localTime: string = formatAMPM(itemDate)
    const tod: string = localTime.includes('pm') ? '🌙' : '☀️'

    item.localDate = monthDayYear(itemDate)
    item.localTime = localTime
    item.tod = tod
  })
}

const processRecords = (
  filter: string,
): {
  modites: Modite[]
  projects: Project[]
} => {
  const date: Date = new Date()
  const modites: Modite[] = filterModites(filter)
  const projects: Project[] = filterProjects(filter)
  processTimestamps(modites, date)

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

const headers: Headers = new Headers({
  'CF-Access-Client-Id': CLOUDFLARE_ID,
  'CF-Access-Client-Secret': CLOUDFLARE_SECRET,
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

const DataProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch]: [DataState, Dispatch<DataAction>] = React.useReducer(reducer, initialState)

  const getData = async (): Promise<void> => {
    const [modites, projects]: [Modite[], Project[]] = await Promise.all([
      fetch(MODITES_URL, { headers }).then(res => res.json()),
      fetch(PROJECTS_URL, { headers }).then(res => res.json()),
    ])

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
      const url: string = `${MODITE_URL}${suffix}`

      fetch(url, { headers })
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

    let minute: number

    // this will run every second but only trigger
    // the getData function when the minute changes
    const tick = (): void => {
      const date: Date = new Date()
      const currentMinutes: number = date.getMinutes()

      if (minute && currentMinutes !== minute) {
        dispatch({ type: 'on-load' })
      }

      minute = currentMinutes
    }

    window.setInterval(tick, 1000)
  }, [])

  return <DataContext.Provider value={[state, props]}>{children}</DataContext.Provider>
}

export { DataProvider }
export default DataContext
