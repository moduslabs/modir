import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Back from '../../components/Back'
import ModiteList from '../../components/ModiteList'
import { useParams } from '../../hook/useRouter'
import Project from '../../models/Project'
import { useData } from '../../service/Data'
import { ContextArray as GlobalContextArray, useGlobal } from '../../service/Global'
import { ContextArray as MapContextArray, defaultViewport, useMap } from '../../service/Map'
import { DataState } from '../../types/service/Data'
import s from './styles.module.scss'

const ProjectDetail = () => {
  const [{ projects }]: [DataState] = useData()
  const [globalState, setGlobalState]: GlobalContextArray = useGlobal()
  const [, setViewport]: MapContextArray = useMap()
  const { id } = useParams()
  const project = projects.find(
    (project: Project): boolean => `${project.id}` === id || `${project.id}` === `project-${id}`,
  )

  if (!project) {
    return <Redirect to="/projects" />
  }

  const { users = [] } = project

  useEffect(() => {
    setGlobalState({
      ...globalState,
      headerHidden: true,
      searchBarHidden: true,
    })

    setViewport({ ...defaultViewport })
  }, [project])

  return (
    <>
      <Back />
      <div className={s.detailContainer}>
        <div className={s.detailInnerContainer}>
          <h2 className={s.name}>{project.name}</h2>
          <div className={s.userNumberHeader}>
            {users.length} Team Member{users.length === 1 ? '' : 's'}
          </div>

          {users.length > 0 ? (
            <ModiteList plain className={s.moditeList} records={users} />
          ) : (
            <div>No current modites</div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProjectDetail
