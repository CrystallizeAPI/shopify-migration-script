import folderMutation from '../mutations/folder.js'
import apiCrystallizeCall from './api-call.js'

const createCrystallizeFolder = (input, injections = {}) => {
  const { apiCall = apiCrystallizeCall } = injections

  return apiCall(folderMutation, input, injections)
}

export default createCrystallizeFolder
