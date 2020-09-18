import productMutation from '../mutations/publish-product'
import apiCall from './api-call'

const publishCrystallizeProduct = (input, injections = {}) => {
  return apiCall(productMutation, input, injections)
}

export default publishCrystallizeProduct
