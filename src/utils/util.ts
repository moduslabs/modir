interface Url {
  pathname: string
  isDetails: boolean
  id: string | undefined
  isProjects: boolean
}

const getUrlInfo = (): Url => {
  const { pathname }: { pathname: string } = window.location
  const isDetails: boolean = pathname.indexOf('/details/') === 0
  const id: string | undefined = isDetails ? pathname.substring(pathname.lastIndexOf('/') + 1) : undefined
  const isProjects: boolean = id ? id.indexOf('project-') === 0 : pathname.indexOf('/projects') === 0

  return { pathname, isDetails, id, isProjects }
}

const getActiveView = (): 'project' | 'projects' | 'modite' | 'modites' => {
  const { isDetails, isProjects } = getUrlInfo()
  if (isProjects) {
    return isDetails ? 'project' : 'projects'
  } else {
    return isDetails ? 'modite' : 'modites'
  }
}

export { getUrlInfo, getActiveView }
