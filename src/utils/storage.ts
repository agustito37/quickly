import moment from "moment"
import { hashCode } from "./helpers"

const QUOTES_KEY = 'quotes_key'
const SCORE_KEY = 'scores'
const STARTED_KEY = 'started'

export interface Quote {
  text: string,
  author?: string,
}

let scoreCache: string | undefined = undefined
let startedCache: boolean | undefined = undefined

export const getQuoteOfTheDay = async (): Promise<Quote> => {
  let quotes = JSON.parse(localStorage.getItem(QUOTES_KEY)!)
  if (!Array.isArray(quotes)) {
    const response = await fetch("https://type.fit/api/quotes")
    quotes = await response.json()
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes))
  }
  return quotes[moment(new Date()).dayOfYear()]
}

export const setStarted = (quote: Quote) => {
  localStorage.setItem(`${STARTED_KEY}-${hashCode(quote.text)}`, '1')
}

export const getStarted = (quote?: Quote) => {
  if (!quote) return false

  if (startedCache) {
    return startedCache
  }

  startedCache = Boolean(localStorage.getItem(`${STARTED_KEY}-${hashCode(quote.text)}`))
  return startedCache
}

export const setScoreOfTheDay = (quote: Quote, score: string) => {
  localStorage.setItem(`${SCORE_KEY}-${hashCode(quote.text)}`, score)
}

export const getScoreOfTheDay = (quote: Quote) => {
  if (scoreCache) {
    return scoreCache
  }

  scoreCache = localStorage.getItem(`${SCORE_KEY}-${hashCode(quote.text)}`) ?? undefined
  return scoreCache
}
