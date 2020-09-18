import folderQuery from '../queries/folder.js'
import apiCrystallizeCall from './api-call.js'
import { CRYSTALLIZE_ROOT_ITEM_ID } from '../../config.js'

const fetchCrystallizeCatalogue = (injections = {}) => {
  const { apiCall = apiCrystallizeCall } = injections

  return apiCall(folderQuery, { itemId: CRYSTALLIZE_ROOT_ITEM_ID }, injections)
}

export default fetchCrystallizeCatalogue
