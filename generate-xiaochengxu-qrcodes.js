const axios = require('axios')
const fs = require('fs')

/***** SET YOUR PARAMS HERE *****/
const APPID = ''
const SECRET = ''
const NUMBERS = 1

main()

async function main() {
  for (let i = 0; i < NUMBERS; i++) {
    const token = await getToken(APPID, SECRET)
    const qrcodeData = await retriveQrcode(token, i)
    fs.writeFile(`./qrcodes/${i+1}.jpg`, qrcodeData, err => console.log(err))
  }
}

async function getToken(appid, secret) {
  const { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
  const { access_token } = data
  console.log('access_token: ', access_token) 
  return access_token
}

async function retriveQrcode(token, scene) {
  const { data } = await axios({
    method: 'post',
    url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${token}`,
    data: { scene: (scene || 123) },
    responseType: 'arraybuffer'
  })
  return data
}
