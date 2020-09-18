import fetch from 'node-fetch'
import FormData from 'form-data'
import xmlJs from 'xml-js'

import apiCall from './api-call'
import { CRYSTALLIZE_TENANT_ID } from '../../config'

function getFileFormData (file, fields) {
  const formData = new FormData()

  fields.forEach(field => formData.append(field.name, field.value))

  formData.append('file', file)

  return formData
}

export default async function uploadFile ({
  filename,
  contentType,
  fileBuffer,
  ...rest
}) {
  const signedUploadResponse = await apiCall(
    `
      mutation generatePresignedRequest($tenantId: ID!, $filename: String!, $contentType: String!) {
        fileUpload {
          generatePresignedRequest(tenantId: $tenantId, filename: $filename, contentType: $contentType) {
            url
            fields {
              name
              value
            }
          }
        }
      }
    `,
    {
      tenantId: CRYSTALLIZE_TENANT_ID,
      filename,
      contentType
    }
  )

  if (!signedUploadResponse || !signedUploadResponse.data) {
    throw new Error('Could not get presigned upload request file')
  }

  /**
   * Append the file to the form data
   */
  const {
    fields,
    url
  } = signedUploadResponse.data.fileUpload.generatePresignedRequest

  // create a form data to store all file form data for this request
  const formData = getFileFormData(fileBuffer, fields)

  const response = await fetch(url, {
    method: 'post',
    body: formData
  })

  if (response.ok) {
    const text = await response.text()
    const json = JSON.parse(xmlJs.xml2json(text))

    const attrs = json.elements[0].elements.map(el => ({
      name: el.name,
      value: el.elements[0].text
    }))

    return {
      filename,
      contentType,
      key: attrs.find(a => a.name === 'Key').value,
      ...rest
    }
  }

  throw new Error('Could not upload file')
}
