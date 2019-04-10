import { VIEW_TYPES } from '../constants/constants'

/* eslint-disable */
// @ts-ignore

function monthDayYear(date) {
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
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return `${month} ${day}, ${year}`
}

function formatAMPM(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  const strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

onmessage = function(event) {
  const start = new Date()
  const { date, filter, filterType, locale, modites, moditeMap, projects } = event.data

  const getTimeOfDay = timeZone => {
    const hour = ~~date.toLocaleString(locale, {
      hour: 'numeric',
      hour12: false,
      timeZone,
    })

    if (hour < 8 || hour > 22) {
      return '🌙'
    }

    return '☀️'
  }

  const filterLowered = filter && filter.toLowerCase()

  const filterRecords = data => {
    const isProject = data[0] && data[0].recordType === 'project'
    const name = isProject ? 'name' : 'real_name'

    // only filter if there is a filter
    const workingArray =
      filter && filterType === VIEW_TYPES.modites
        ? data.filter(item => item[name].toLowerCase().indexOf(filterLowered) > -1)
        : data

    return workingArray
      .sort((prev, next) => {
        const prevName = isProject ? prev.name : prev.profile.last_name
        const nextName = isProject ? next.name : next.profile.last_name

        if (prevName < nextName) {
          return -1
        }
        if (prevName > nextName) {
          return 1
        }
        return 0
      })
      .map(item => {
        const nowUtc = new Date(date.getTime() + date.getTimezoneOffset())
        const itemDate = new Date(nowUtc - item.tz_offset * 60000)
        const localTime = formatAMPM(itemDate)
        const tod = localTime.includes('pm') ? '🌙' : '☀️'

        return {
          ...item,
          localDate: monthDayYear(itemDate),
          localTime,
          // eslint-disable-next-line @typescript-eslint/camelcase
          real_name: item[name],
          tod,
        }
      })
  }

  const message = {
    modites: filterRecords(modites),
    projects: filterRecords(projects),
  }

  if (!moditeMap) {
    const map = {}

    modites.forEach(modite => {
      map[modite.id] = modite
    })

    message.moditeMap = map
  }

  projects.forEach(project => {
    project.users = project.users.length
      ? filterRecords(project.users.map(user => message.moditeMap[user.id]).filter(Boolean))
      : []
  })

  postMessage(message)
}
