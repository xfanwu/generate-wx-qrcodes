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
    const ticket = await getTicket(token, i+1)
    const qrcodeData = await retriveQrcode(ticket)
    fs.writeFile(`./qrcodes/${i+1}.jpg`, qrcodeData, err => console.log(err))
  }
}

async function getToken(appid, secret) {
  const { data } = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
  const { access_token } = data
  console.log('access_token: ', access_token) 
  return access_token
}

async function getTicket(token, sceneId) {
  const { data } = await axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${token}`, {
    action_name: "QR_LIMIT_SCENE", 
    action_info: {
      scene: {
        scene_id: sceneId || 123
      }
    } 
  })
  const { ticket } = data
  console.log('ticket: ', ticket) 
  return ticket
}

async function retriveQrcode(ticket) {
  const { data } = await axios({
    method: 'get',
    url: `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${ticket}`,
    responseType: 'arraybuffer'
  })
  return data
}
