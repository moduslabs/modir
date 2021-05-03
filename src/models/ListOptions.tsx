export type SortTypes = 'lasta' | 'lastd' | 'firsta' | 'firstd' | 'tacosa' | 'tacosd' | 'timea' | 'timed'
export type ViewTypes = 'list' | 'globe'

export interface ListOptions {
  view: ViewTypes
  sort: SortTypes
}
