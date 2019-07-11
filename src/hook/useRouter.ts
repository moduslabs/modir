// https://github.com/ReactTraining/react-router/issues/6430#issuecomment-497950821

import { Location } from 'history'
import queryString, { ParsedQuery } from 'query-string'
import { useContext, useMemo, useCallback } from 'react'
import { __RouterContext, RouteComponentProps } from 'react-router'
import uriTemplate, { URITemplate } from 'uri-templates'

export interface Params {
  id: string
  slug: string
}

interface UpdateQueryOptions {
  replace: boolean
}

type UpdateQuery<T> = (patch: Partial<T>) => void

type Visit<T> = (params: T) => void

const USE_PUSH: UpdateQueryOptions = {
  replace: false,
}

export const useRouter = <T>(): RouteComponentProps<T> => useContext(__RouterContext) as RouteComponentProps<T>

export const useLocation = (): Location => {
  const { location } = useRouter()

  return location
}

export const useParams = <T>(): T => {
  const {
    match: { params },
  } = useRouter<T>()

  return params
}

export const useQuery = <T extends ParsedQuery>(): T => {
  const { search } = useLocation()

  return useMemo(() => queryString.parse(search), [search]) as T
}

export const useUpdateQuery = <T extends ParsedQuery>(options: UpdateQueryOptions = USE_PUSH): UpdateQuery<T> => {
  const { history } = useRouter()
  const query = useQuery<T>()
  const { replace } = options

  return useCallback(
    (patch: Partial<T>): void => {
      const newQuery = { ...query, ...patch }
      const newSearch = queryString.stringify(newQuery)

      if (replace) {
        history.replace({ search: newSearch })
      } else {
        history.push({ search: newSearch })
      }
    },
    [history, query, replace],
  )
}

export const useNavigate = <T>(to: string | URITemplate, options: UpdateQueryOptions = USE_PUSH): Visit<T> => {
  const { history } = useRouter()
  const { replace } = options
  const template = useMemo(() => (typeof to === 'string' ? uriTemplate(to) : to), [to])

  return useCallback(
    (params: T): void => {
      const newLocation = template.fill(params as any)

      if (replace) {
        history.replace(newLocation)
      } else {
        history.push(newLocation)
      }
    },
    [template, history, replace],
  )
}
