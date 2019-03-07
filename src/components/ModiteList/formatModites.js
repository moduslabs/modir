// @ts-ignore
onmessage = function(event) {
  const { modites, filter, date, locale } = event.data;

  const getTimeOfDay = (date, timeZone, locale) => {
    const hour = ~~date.toLocaleString(locale, {
      timeZone,
      hour: 'numeric',
      hour12: false,
    });
    if (hour < 8 || hour > 22) return '💤';
    return '😃';
  };

  const filtered = modites
    .filter(
      modite =>
        modite.real_name.toLowerCase().indexOf(filter.toLowerCase()) > -1
    )
    .sort((prev, next) => {
      const prevName = prev.profile.last_name;
      const nextName = next.profile.last_name;

      if (prevName < nextName) return -1;
      if (prevName > nextName) return 1;
      return 0;
    })
    .map(modite => ({
      ...modite,
      localTime: date.toLocaleString(locale, {
        timeZone: modite.tz,
        hour: 'numeric',
        minute: 'numeric',
      }),
      tod: getTimeOfDay(date, modite.tz, locale),
    }));

  postMessage(filtered);
};
