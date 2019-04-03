/* eslint-disable */
// @ts-ignore
onmessage = function(event) {
  const { modites, filter, date, locale } = event.data

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

  const isProject = modites.length && modites[0].recordType === 'project'

  const filterRecords = modites => {
    const filtered = modites
      .filter(modite => {
        const name = isProject ? 'name' : 'real_name'
        return modite[name].toLowerCase().indexOf(filter.toLowerCase()) > -1
      })
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
      .map(modite => ({
        ...modite,
        localDate: date.toLocaleString(locale, {
          day: 'numeric',
          month: 'long',
          timeZone: modite.tz,
          year: 'numeric',
        }),
        localTime: date.toLocaleString(locale, {
          hour: 'numeric',
          minute: 'numeric',
          timeZone: modite.tz,
        }),
        // eslint-disable-next-line @typescript-eslint/camelcase
        real_name: modite.real_name || modite.name,
        tod: getTimeOfDay(modite.tz),
      }))

    return filtered
  }

  if (isProject) {
    modites.forEach(project => {
      project.users = filterRecords(project.users)
    })

    postMessage(modites)
  } else {
    postMessage(filterRecords(modites))
  }
}
