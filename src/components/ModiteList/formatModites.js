/* eslint-disable */
// @ts-ignore
onmessage = function (event) {
  const {
    date,
    filter,
    filterType,
    locale,
    modites,
    moditeMap,
    projects
  } = event.data

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

  const isProject = filterType === 'project'
  const name = isProject ? 'name' : 'real_name'
  const filterLowered = filter && filter.toLowerCase()

  const filterRecords = data => {
    // only filter if there is a filter
    const workingArray = filter ? data.filter(item => item[name].toLowerCase().indexOf(filterLowered) > -1) : data

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
      .map(item => ({
        ...item,
        localDate: date.toLocaleString(locale, {
          day: 'numeric',
          month: 'long',
          timeZone: item.tz,
          year: 'numeric',
        }),
        localTime: date.toLocaleString(locale, {
          hour: 'numeric',
          minute: 'numeric',
          timeZone: item.tz,
        }),
        // eslint-disable-next-line @typescript-eslint/camelcase
        real_name: item[name],
        tod: getTimeOfDay(item.tz),
      }))
  }

  const message = {
    modites: filterRecords(modites),
    projects,
  }

  if (!moditeMap) {
    const map = {}

    modites.forEach(modite => {
      map[modite.id] = modite
    })

    message.moditeMap = map
  }

  projects.forEach(project => {
    project.users = project.users.length ? filterRecords(project.users.map(user => message.moditeMap[user.id]).filter(Boolean)) : []
  })

  postMessage(message)
}
