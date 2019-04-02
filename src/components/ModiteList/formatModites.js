// @ts-ignore
onmessage = function(event) {
  const { modites, filter, date, locale } = event.data

  const getTimeOfDay = timeZone => {
    // tslint:disable-next-line: no-bitwise
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
      localDate: isProject
        ? ''
        : date.toLocaleString(locale, {
            day: 'numeric',
            month: 'long',
            timeZone: modite.tz,
            year: 'numeric',
          }),
      localTime: isProject
        ? ''
        : date.toLocaleString(locale, {
            hour: 'numeric',
            minute: 'numeric',
            timeZone: modite.tz,
          }),
      real_name: modite.real_name || modite.name,
      tod: isProject ? '' : getTimeOfDay(modite.tz),
    }))

  postMessage(filtered)
}
