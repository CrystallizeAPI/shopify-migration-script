import delFolderMutation from '../mutations/del-folder.js'
import apiCrystallizeCall from './api-call.js'

const delCrystallizeFolder = (id, injections = {}) => {
  const { apiCall = apiCrystallizeCall } = injections

  return apiCall(delFolderMutation, { itemId: id }, injections)
}

export default delCrystallizeFolder
