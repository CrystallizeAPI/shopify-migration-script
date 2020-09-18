import apiCall from '../../lib/crystallize/api-call'
import sinon from 'sinon'

const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

describe('crystallize', () => {
  describe('api Call', () => {
    it('Attempts to run request 2 times if failure', async () => {
      const apiRequest = sinon.fake.rejects('this is done')

      await expect(
        apiCall(null, null, null, null, { apiRequest, attempts: 2 })
      ).to.be.rejectedWith('this is done')

      sinon.assert.calledThrice(apiRequest)
    }).timeout(200000)

    it('Runs request a single time on success', async () => {
      const apiRequest = sinon.fake.resolves('this is done')

      await apiCall(null, null, null, null, { apiRequest, attempts: 2 })

      sinon.assert.calledOnce(apiRequest)
    })
  })
})
