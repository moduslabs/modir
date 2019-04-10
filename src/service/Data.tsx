import React, { Context, createContext, useEffect } from 'react'
import { MockModites, MockProjects } from './mockData'
import Modite from '../models/Modite'
import Project from '../models/Project'
import { getUrlInfo } from '../utils/util'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataContext: Context<any> = createContext([{}, Function])

const getActiveView = (): string => {
  const { isDetails, isProjects } = getUrlInfo()
  const suffix = isDetails ? '' : 's'
  return isProjects ? `project${suffix}` : `modite${suffix}`
}

let rawModites: Modite[] = []
let rawProjects: Project[] = []

const sortRecords = (records: (Modite | Project)[]): void => {
  if (records.length) {
    const isProject: boolean = records[0].recordType === 'project'

    records.sort((prev: any, next: any) => {
      const prevName: string = isProject ? prev.name : prev.profile.last_name
      const nextName: string = isProject ? next.name : next.profile.last_name

      if (prevName < nextName) return -1
      if (prevName > nextName) return 1
      return 0
    })
  }
}

let moditeMap: { [key: string]: Modite } = {}

const filterRecords = (
  records: (Modite | Project)[],
  type: 'modites' | 'projects',
  filter: string = '',
): (Modite | Project)[] => {
  const filterLowered: string = filter.toLowerCase()
  const name: 'real_name' | 'name' = type === 'modites' ? 'real_name' : 'name'

  return filter.length
    ? (records as (Modite | Project)[]).filter(item => (item[name] as string).toLowerCase().indexOf(filterLowered) > -1)
    : records
}
const filterModites = (filter: string): Modite[] => {
  const filteredModites = filterRecords([...rawModites], 'modites', filter)
  return filteredModites
}
const filterProjects = (filter: string): Project[] => filterRecords([...rawProjects], 'projects', filter) as Project[]

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
  const nowUtc: any = new Date(date.getTime() + date.getTimezoneOffset())

  records.forEach((item: Modite) => {
    const itemDate = new Date(nowUtc - (item.tz_offset as number) * 60000)
    const localTime = formatAMPM(itemDate)
    const tod = localTime.includes('pm') ? '🌙' : '☀️'

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
  if (!Object.keys(moditeMap).length) {
    rawModites.forEach((modite: Modite) => (moditeMap[modite.id as string] = modite))
    rawProjects.forEach((project: Project) => {
      project.users = project.users.map((modite: Modite) => moditeMap[modite.id as string])
      project.users = project.users.filter(Boolean)
    })
  }

  const date = new Date()
  const modites: Modite[] = filterModites(filter)
  const projects: Project[] = filterProjects(filter)
  processTimestamps(modites, date)

  return { modites, projects }
}

const reducer = (state: any, action: any) => {
  let processed: { modites: Modite[]; projects: Project[] }

  switch (action.type) {
    case 'on-filter':
      processed = processRecords(action.filter)
      return {
        ...state,
        filter: action.filter,
        modites: processed.modites,
        projects: processed.projects,
        mapRecords: processed.modites,
      }
    case 'on-active-view':
      const activeView = getActiveView()
      const obj = {
        ...state,
        activeView,
        activeModite: undefined,
        activeProject: undefined,
        mapRecords: state.modites,
      }
      const { id } = getUrlInfo()
      const date = new Date()

      if (activeView === 'modite') {
        const activeModite = rawModites.find((modite: Modite) => modite.id === id)
        // TODO: fetch modite profile details if a record is found and the profile details are not
        processTimestamps([activeModite as Modite], date)
        return {
          ...obj,
          activeModite,
          mapRecords: activeModite,
        }
      } else if (activeView === 'project') {
        const activeProject = rawProjects.find((project: Project) => project.id === id)
        processTimestamps((activeProject as Project).users, date)
        return {
          ...obj,
          activeProject,
          mapRecords: (activeProject as Project).users,
        }
      } else {
        processed = processRecords(state.filter)
        return {
          ...obj,
          projects: processed.projects,
          mapRecords: processed.modites,
        }
      }
    case 'on-load':
      processed = processRecords('')
      return {
        ...state,
        modites: processed.modites,
        projects: processed.projects,
      }
    default:
      throw new Error()
  }
}

const initialState = {
  filter: '',
  modites: [],
  projects: [],
  activeView: getActiveView(),
  activeModite: undefined,
  activeProject: undefined,
}

const DataProvider = ({ children }: { children?: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const getData = async () => {
    // const headers = new Headers({
    //   'CF-Access-Client-Id': `${process.env.CLOUDFLARE_ID}`,
    //   'CF-Access-Client-Secret': `${process.env.CLOUDFLARE_SECRET}`,
    // })
    // const [modites, projects] = await Promise.all([
    //   fetch('https://dir.modus.app/modites/all', { headers }).then(res => res.json()),
    //   fetch('https://dir.modus.app/projects/all', { headers }).then(res => res.json()),
    // ])

    // fallback for connection issues to continue dev
    rawModites = MockModites
    sortRecords(rawModites)
    rawProjects = MockProjects
    sortRecords(rawProjects)
    rawProjects.forEach((project: Project) => {
      if (project.users) sortRecords(project.users)
    })

    dispatch({
      type: 'on-load',
    })
  }

  const props = {
    setFilter: (filter: string) => {
      dispatch({
        type: 'on-filter',
        filter,
      })
    },
    setActiveView: () => {
      dispatch({ type: 'on-active-view' })
    },
  }

  useEffect(() => {
    getData()

    let minute: number

    // this will run every second but only trigger
    // the getData function when the minute changes
    const tick = () => {
      const date = new Date()
      const currentMinutes = date.getMinutes()

      if (minute && currentMinutes !== minute) {
        dispatch({ type: 'on-active-view' })
      }

      minute = currentMinutes
    }

    window.setInterval(tick, 1000)
  }, [])

  return <DataContext.Provider value={[state, props]}>{children}</DataContext.Provider>
}

export { DataProvider }
export default DataContext
