import topicMutation from '../mutations/topic.js'
import apiCrystallizeCall from './api-call.js'

const createCrystallizeTopic = (input, injections = {}) => {
  const { apiCall = apiCrystallizeCall } = injections

  return apiCall(topicMutation, input, injections)
}

export default createCrystallizeTopic
