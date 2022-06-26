import moment from "moment";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { getCustomAuthorParam, getCustomChallengeParam } from "../utils/helpers";
import { getQuoteOfTheDay, getScoreOfTheDay, getStarted, Quote, setScoreOfTheDay, setStarted } from "../utils/storage";

interface Timer {
  interval: NodeJS.Timer,
  startTime: Date,
}

const DEFAULT_TIMER = '00:00:0'

export const useGame = () => {
  const [isCustomChallenge, setIsCustomChallenge] = useState(false)
  const [quote, setQuote] = useState<Quote>()
  const [index, setIndex] = useState(0)
  const interval = useRef<Timer>()
  const [timer, setTimer] = useState(DEFAULT_TIMER);
  const mobileInputRef = useRef<HTMLInputElement>(null)

  const hasPlayed = getStarted(quote)
  const notStarted = !quote || index === 0
  const hasFinished = quote && index === quote.text.length

  const leftText = quote?.text.slice(0, index)
  const rightText = quote?.text.slice(index+1)
  const letter = quote?.text[index]

  const initGame = async () => {
    let quote: Quote
    const customChalenge = getCustomChallengeParam()
    if (customChalenge) {
      setIsCustomChallenge(Boolean(customChalenge))
      const customAuthor = getCustomAuthorParam()
      quote = { text: customChalenge, author: customAuthor ?? undefined } 
    } else {
      quote = await getQuoteOfTheDay()
    }
    setQuote(quote)

    // if the game has already been played we finish the game
    if (quote && getStarted(quote)) {
      setIndex(quote.text.length)
    } 

    setTimer(getScoreOfTheDay(quote) ?? DEFAULT_TIMER)
  }

  useEffect(() => {
    initGame()
  }, [])

  const onTimerUpdate = useCallback((finish = false) => {
    const startTime = interval.current!.startTime
    const currentTime = new Date()
    let difference = moment(moment(currentTime).diff(startTime)).format('mm:ss:S')
    setTimer(difference)

    if (finish) {
      setScoreOfTheDay(quote!, difference)
    }
  }, [quote])

  const onKeyPressed = useCallback(({ key }: { key: string }) => {
    if (key === letter) {
      if (!interval.current) {
        interval.current = {
          interval: setInterval(onTimerUpdate, 100),
          startTime: new Date(),
        }

        setStarted(quote!)
      }

      setIndex((i) => {
        const newIndex = i + 1
        if (newIndex === quote?.text.length) {
          onTimerUpdate(true)
          clearInterval(interval.current!.interval)
        }
        return newIndex
      })
    }
  }, [letter, onTimerUpdate, quote])

  useEffect(() => {
    window.addEventListener("keydown", onKeyPressed)
    return () => {
      window.removeEventListener("keydown", onKeyPressed)
    };
  }, [onKeyPressed]);

  const onMobileKeyboardShow = () => {
    mobileInputRef.current?.focus()
  }

  const onMobileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onKeyPressed({ key: event.target.value?.[event.target.value.length-1] })
  }

  return {
    quote,
    letter,
    rightText,
    leftText,
    timer,
    notStarted,
    hasFinished,
    hasPlayed,
    mobileInputRef,
    onMobileKeyboardShow,
    onMobileChange,
    isCustomChallenge,
  }
}
