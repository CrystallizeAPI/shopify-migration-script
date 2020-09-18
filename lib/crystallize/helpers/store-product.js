import productMutation from '../mutations/product'
import apiCall from './api-call'

const createCrystallizeProduct = (input, injections = {}) => {
  return apiCall(productMutation, input, injections)
}

export default createCrystallizeProduct
