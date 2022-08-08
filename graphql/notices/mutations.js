import gql from 'graphql-tag'
import { NOTICE_FIELDS_FRAGMENT } from './fragments'

export const CREATE_NOTICE_MUTATION = gql`
  mutation CreateMutation(
    $description: String!
    $title: String
    $photo: Upload
    $date: String!
    $workspaceId: Int!
  ) {
    createNotice(
      description: $description
      title: $title
      photo: $photo
      date: $date
      workspaceId: $workspaceId
    ) {
      ...NoticeFields
    }
  }
  ${NOTICE_FIELDS_FRAGMENT}
`

export const UPDATE_NOTICE_MUTATION = gql`
  mutation UpdateMutation(
    $id: ID!
    $description: String!
    $title: String
    $photo: Upload
    $date: String!
    $workspaceId: Int!
  ) {
    updateNotice(
      id: $id
      description: $description
      title: $title
      photo: $photo
      date: $date
      workspaceId: $workspaceId
    ) {
      ...NoticeFields
    }
  }
  ${NOTICE_FIELDS_FRAGMENT}
`

export const DELETE_NOTICE_MUTATION = gql`
  mutation DeleteNoticeMutation($workspaceId: Int!, $id: Int!) {
    deleteNotice(workspaceId: $workspaceId, id: $id) {
      id
    }
  }
`
export const PUBLISH_NOTICE_MUTATION = gql`
  mutation PublishNoticeMutation($workspaceId: Int!, $id: Int!) {
    publishNotice(workspaceId: $workspaceId, id: $id) {
      id
      published
    }
  }
`
export const CREATE_ROW_MUTATION = gql`
  mutation UpdatexMutation($description: [ObjectT]) {
    createRow(description: $description) {
      id
    }
  }
`
