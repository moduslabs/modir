import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import GitHub from '../../components/GitHub'
import ModiteImage from '../../components/ModiteImage'
import Row from '../../components/ProjectList/Row'
import Skype from '../../components/Skype'
import Time from '../../components/Time'
import { useParams } from '../../hook/useRouter'
import Modite from '../../models/Modite'
import Project from '../../models/Project'
import { ContextArray as DataContextArray, getModiteData, useData } from '../../service/Data'
import { ContextArray as MapContextArray, useMap } from '../../service/Map'
import { Dimensions, useWindowDimensions } from '../../service/WindowDimensions'
import s from './styles.module.scss'

const ModiteDetail = () => {
  const [{ modites, projects }]: DataContextArray = useData()

  const [viewport, setViewport]: MapContextArray = useMap()
  const { id } = useParams()
  const dimensions: Dimensions = useWindowDimensions()
  const modite = modites.find((modite: Modite): boolean => modite.id === id)

  if (!modite) {
    return <Redirect to="/" />
  }

  const { real_name: name, tacos }: Modite = modite
  const { moditeData, isLoading } = getModiteData(id)

  const { fields, title, display_name } = moditeData
  const { Location, 'GitHub User': gitHubUser, 'Skype User': skypeUser } = fields
  const moditeProjects: Project[] = projects.reduce((matches: Project[], project: Project) => {
    if (project.users && project.users.find((user: Modite) => user.id === id)) {
      matches.push(project)
    }

    return matches
  }, [])

  useEffect(() => {
    if (isLoading === false) {
      const locationDataExists =
        Object.keys(fields).length > 0 &&
        fields.locationData &&
        Object.keys(fields.locationData).length > 0 &&
        fields.locationData.lat &&
        fields.locationData.lon
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const newViewport = locationDataExists
        ? {
            ...viewport,
            latitude: fields.locationData!.lat - dimensions.height / 160,
            longitude: fields.locationData!.lon,
            //FIXME: because the modite profile returned from modites API does not have profile
            modite: { ...modite, profile: moditeData },
            zoom: 5,
          }
        : {
            ...viewport,
            modite: undefined,
          }
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
      setViewport(newViewport)
    }
  }, [modite, isLoading])

  return (
    <div className={s.detailContainer}>
      <div className={s.detailInnerContainer}>
        <div className={s.tacos}>
          <span className={s.taco}>🌮</span>
          {tacos}
        </div>

        <div className={s.gitUser}>
          {gitHubUser ? <GitHub iconOnly name={gitHubUser} /> : null}
          {skypeUser ? <Skype iconOnly name={skypeUser} /> : null}
        </div>

        <h2 className={s.name}>{name}</h2>

        <div className={s.location}>{Location}</div>

        <div className={s.todWrap}>
          <Time modite={modite} date />
        </div>

        <div className={s.fieldTitle}>{title}</div>

        <div className={s.slackName}>@{display_name}</div>

        <h4 className={s.projectHeader}>
          {moditeProjects.length === 0 ? 'Projects' : `Projects (${moditeProjects.length})`}
        </h4>

        {moditeProjects.length ? (
          <div className={s.projectList}>
            {moditeProjects.map((project: Project) => (
              <Row key={project.id} addSpacerRow={false} plain style={{ height: '60px' }} project={project} />
            ))}
          </div>
        ) : (
          <div>No current projects</div>
        )}
      </div>

      <ModiteImage className={s.thumbContainer} modite={modite} />
    </div>
  )
}

export default ModiteDetail
