import moment from "moment";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { getCustomChallengeParam } from "../utils/helpers";
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

  const hasPlayed = getStarted()
  const notStarted = (isCustomChallenge || !hasPlayed) && (!quote || index === 0)
  const hasFinished = quote && index === quote.text.length

  const leftText = quote?.text.slice(0, index)
  const rightText = quote?.text.slice(index+1)
  const letter = quote?.text[index]

  useEffect(() => {
    const customChalenge = getCustomChallengeParam()
    setIsCustomChallenge(Boolean(customChalenge))
    if (customChalenge) {
      setQuote({ text: customChalenge })
    } else {
      setTimer(getScoreOfTheDay() ?? DEFAULT_TIMER)
      getQuoteOfTheDay().then((quote) => setQuote(quote))
    }
  }, [])

  // if the game has finished we finish the game
  useEffect(() => {
    if (quote && getStarted() && !isCustomChallenge) {
      setIndex(quote.text.length)
    } 
  }, [quote, isCustomChallenge])

  const onTimerUpdate = useCallback((finish = false) => {
    const startTime = interval.current!.startTime
    const currentTime = new Date()
    let difference = moment(moment(currentTime).diff(startTime)).format('mm:ss:S')
    setTimer(difference)

    if (finish && !isCustomChallenge) {
      setScoreOfTheDay(difference)
    }
  }, [isCustomChallenge])

  const onKeyPressed = useCallback(({ key }: { key: string }) => {
    if (key === letter) {
      if (!interval.current) {
        interval.current = {
          interval: setInterval(onTimerUpdate, 100),
          startTime: new Date(),
        }

        if (!isCustomChallenge) {
          setStarted()
        }
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
  }, [letter, onTimerUpdate, isCustomChallenge, quote])

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
