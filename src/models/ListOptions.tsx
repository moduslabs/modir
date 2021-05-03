export type SortTypes = 'lasta' | 'lastd' | 'firsta' | 'firstd'
export type ViewTypes = 'list' | 'globe'

export interface ListOptions {
  view: ViewTypes
  sort: SortTypes
}

