/* eslint-disable */
// @ts-ignore
onmessage = function(event) {
  const { modites, projects, filter, date, locale } = event.data

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

  const processDates = (records = []) => {
    return records.map(modite => ({
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
  }

  const processRecords = (records = [], type = 'modites') => {
    const isProject = type === 'projects'

    let processed = records.sort((prev, next) => {
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

    if (type === 'modites') {
      processed = processDates(processed)
    } else {
      processed.forEach(item => {
        item.users = processDates(item.users)
      })
    }

    return processed
  }

  const filterRecords = (records, type = 'modites') => {
    const isProject = type === 'projects'

    return records.filter(modite => {
      const name = isProject ? 'name' : 'real_name'
      return modite[name].toLowerCase().indexOf(filter.toLowerCase()) > -1
    })
  }

  const allModites = processRecords(modites)
  const filteredModites = filterRecords([...allModites])
  const allProjects = processRecords(projects, 'projects')
  const filteredProjects = filterRecords([...allProjects], 'projects')

  postMessage({ allModites, filteredModites, allProjects, filteredProjects })
}
