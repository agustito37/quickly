import moment from "moment"

const QUOTES_KEY = 'quotes_key'
const SCORE_KEY = 'scores'
const STARTED_KEY = 'started'

export interface Quote {
  text: string,
  author: string,
}

let scoreCache: string | undefined = undefined
let startedCache: boolean | undefined = undefined

const getTodayKey = () => {
  return moment().format('YYYYDDMM')
}

export const getQuoteOfTheDay = async (): Promise<Quote> => {
  let quotes = JSON.parse(localStorage.getItem(QUOTES_KEY)!)
  if (!Array.isArray(quotes)) {
    const response = await fetch("https://type.fit/api/quotes")
    quotes = await response.json()
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes))
  }
  return quotes[moment(new Date()).dayOfYear()]
}

export const setStarted = () => {
  localStorage.setItem(`${STARTED_KEY}-${getTodayKey()}`, '1')
}

export const getStarted = () => {
  if (startedCache) {
    return startedCache
  }

  startedCache = Boolean(localStorage.getItem(`${STARTED_KEY}-${getTodayKey()}`))
  return startedCache
}

export const setScoreOfTheDay = (score: string) => {
  localStorage.setItem(`${SCORE_KEY}-${getTodayKey()}`, score)
}

export const getScoreOfTheDay = () => {
  if (scoreCache) {
    return scoreCache
  }

  scoreCache = localStorage.getItem(`${SCORE_KEY}-${getTodayKey()}`) ?? undefined
  return scoreCache
}
