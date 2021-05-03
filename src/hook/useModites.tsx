import { ListOptions } from '../models/ListOptions'
import Modite from '../models/Modite'

const useModites = (records: Modite[]) => {
  let options: ListOptions

  const savedListOptions = localStorage.getItem('list-options')
  if (savedListOptions) {
    options = JSON.parse(savedListOptions)
  } else {
    options = {
      view: 'list',
      sort: 'lasta',
    }
  }
  let sort_records = [...records]
  switch (options.sort) {
    case 'lasta':
      break
    case 'lastd':
      sort_records = sort_records.reverse()
      break
    case 'firsta':
      sort_records.sort((a, b) => {
        const aFirst = a.real_name.split(' ').shift(),
          bFirst = b.real_name.split(' ').shift()
        return aFirst.localeCompare(bFirst)
      })
      break
    case 'firstd':
      sort_records.sort((a, b) => {
        const aFirst = a.real_name.split(' ').shift(),
          bFirst = b.real_name.split(' ').shift()
        return bFirst.localeCompare(aFirst)
      })
      break
    case 'tacosa':
      sort_records.sort((a, b) => {
        return a.tacos - a.tacos
      })
      break
    case 'tacosd':
      sort_records.sort((a, b) => {
        return b.tacos - a.tacos
      })
      break
    case 'timea':
      sort_records.sort((a, b) => {
        return a.tz_offset - b.tz_offset
      })
      break
    case 'timed':
      sort_records.sort((a, b) => {
        return b.tz_offset - a.tz_offset
      })
      break
  }
  return sort_records
}

export default useModites
