import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import Row from '../../components/ModiteList/Row'
import { useParams } from '../../hook/useRouter'
import Modite from '../../models/Modite'
import Project from '../../models/Project'
import { ContextArray as DataContextArray, useData } from '../../service/Data'
import { ContextArray as MapContextArray, defaultViewport, useMap } from '../../service/Map'
import s from './styles.module.scss'

const ProjectDetail = () => {
  const [{ projects }, dispatch]: DataContextArray = useData()
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
    dispatch({
      type: 'filter-project-users',
      modites: users,
    })

    setViewport({ ...defaultViewport })
  }, [project])

  return (
    <div className={s.detailContainer}>
      <div className={s.detailInnerContainer}>
        <h2 className={s.name}>{project.name}</h2>
        <div className={s.userNumberHeader}>
          {users.length} Team Member{users.length === 1 ? '' : 's'}
        </div>

        {users.length ? (
          <div className={s.userList}>
            {users.map((modite: Modite) => (
              <Row key={modite.id} addSpacerRow={false} plain style={{ height: '60px' }} modite={modite} />
            ))}
          </div>
        ) : (
          <div>No current modites</div>
        )}
      </div>
    </div>
  )
}

export default ProjectDetail
