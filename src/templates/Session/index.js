import React from 'react'
import { graphql } from 'gatsby'
import moment from 'moment'
import 'moment-timezone'

import Layout from '../../components/layout/Layout'
import Speaker from '../../components/fields/Speaker'
import Link from '../../components/fields/Link'

import './style.scss'

const SessionTemplate = ({ data }) => {
  const node = data.nodeSession
  const { room, speakers } = node.r
  const time = moment(node.time)
    .tz('America/New_York')
    .format('MMM DD HH:mma')

  return (
    <Layout>
      <div className="session">
        <h1 className="session--title">{node.title}</h1>
        {speakers && (
          <div className="session--speakers-container">
            <div className="session--speakers-title">Speakers:</div>
            {speakers.map((speaker, key) => (
              <Speaker key={key} {...speaker} />
            ))}
          </div>
        )}

        <div className="session--date-time">{time}</div>
        {room && <div className="session--room">{room.name}</div>}

        <div
          className="session-summary"
          dangerouslySetInnerHTML={{
            __html: node.body ? node.body.processed : '',
          }}
        />
        <Link to="/sessions">Back to Sessions</Link>
      </div>
    </Layout>
  )
}

export default SessionTemplate

export const query = graphql`
  query SessionTemplate($slug: Int!) {
    nodeSession(drupal_internal__nid: { eq: $slug }) {
      title
      datetime: field_time(formatString: "dd")
      day: field_time(formatString: "dd")
      time: field_time
      r: relationships {
        room: field_room {
          name
        }
        speakers: field_speakers {
          title
          r: relationships {
            field_company {
              title
            }
            field_photo {
              localFile {
                childImageSharp {
                  fixed(width: 100, height: 100) {
                    src
                    srcSet
                    aspectRatio
                  }
                }
              }
            }
          }
        }
      }
      field_session_length
      body {
        processed
      }
      path {
        alias
      }
      field_time
    }
  }
`
