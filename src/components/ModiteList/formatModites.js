/* eslint-disable */
// @ts-ignore
onmessage = function (event) {
  const {
    date,
    filter,
    filterType,
    locale,
    modites,
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
  const filterLowered = filter.toLowerCase()

  const filterRecords = data => {
    const filtered = data
      // TODO don't filter if no filter
      .filter(item => item[name].toLowerCase().indexOf(filterLowered) > -1)
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

    return filtered
  }

  if (isProject) {
    projects.forEach(project => {
      project.users = filterRecords(project.users)
    })

    postMessage({
      modites,
      projects,
    })
  } else {
    postMessage({
      modites: filterRecords(modites),
      projects,
    })
  }
}
