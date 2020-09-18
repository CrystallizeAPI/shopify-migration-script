import download from 'download'

export const downloadImage = (url, dir) => download(url, `${dir}/temp`)
