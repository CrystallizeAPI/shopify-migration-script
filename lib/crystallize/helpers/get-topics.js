import apiCrystallizeCall from './api-call'
import { CRYSTALLIZE_TENANT_ID, CRYSTALLIZE_LANGUAGE_CODE } from '../../config'
import topicQuery from '../queries/topics'

const fetchCrystallizeTopics = (injections = {}) => {
  const { apiCall = apiCrystallizeCall } = injections

  return apiCall(
    topicQuery,
    { tenantId: CRYSTALLIZE_TENANT_ID, language: CRYSTALLIZE_LANGUAGE_CODE },
    injections
  )
}
export default fetchCrystallizeTopics
