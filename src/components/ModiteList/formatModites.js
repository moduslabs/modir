// @ts-ignore
onmessage = function(event) {
  const { modites, filter, date, locale } = event.data;

  const getTimeOfDay = (date, timeZone, locale) => {
    const hour = ~~date.toLocaleString(locale, {
      timeZone,
      hour: 'numeric',
      hour12: false,
    });
    if (hour < 8 || hour > 22) return '🌙';
    return '☀️';
  };

  const isProject = modites.length && modites[0].recordType === 'project';

  const filtered = modites
    .filter(
      modite => {
        const name = isProject ? 'name' : 'real_name';
        return modite[name].toLowerCase().indexOf(filter.toLowerCase()) > -1;
      }
    )
    .sort((prev, next) => {
      const prevName = isProject ? prev.name : prev.profile.last_name;
      const nextName = isProject ? next.name : next.profile.last_name;

      if (prevName < nextName) return -1;
      if (prevName > nextName) return 1;
      return 0;
    })
    .map(modite => ({
      ...modite,
      'real_name': modite.real_name || modite.name,
      localTime: isProject ? '' : date.toLocaleString(locale, {
        timeZone: modite.tz,
        hour: 'numeric',
        minute: 'numeric',
      }),
      localDate: isProject ? '' : date.toLocaleString(locale, {
        timeZone: modite.tz,
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      tod: isProject ? '' : getTimeOfDay(date, modite.tz, locale),
    }));

  postMessage(filtered);
};
