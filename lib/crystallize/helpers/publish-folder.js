import folderMutation from '../mutations/publish-folder.js'
import apiCall from './api-call.js'

const publishCrystallizeFolder = (input, injections = {}) => {
  return apiCall(folderMutation, input, injections)
}

export default publishCrystallizeFolder
