import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { isMobile } from "../utils/helpers";
import { getQuoteOfTheDay, getScoreOfTheDay, getStarted, Quote, setScoreOfTheDay, setStarted } from "../utils/storage";

interface Timer {
  interval: NodeJS.Timer,
  startTime: Date,
}

export const useGame = () => {
  const [quote, setQuote] = useState<Quote>()
  const [index, setIndex] = useState(0)
  const interval = useRef<Timer>()
  const [timer, setTimer] = useState(getScoreOfTheDay() ?? '00:00:0');

  const hasPlayed = getStarted()
  const notStarted = !hasPlayed && (!quote || index === 0)
  const hasFinished = quote && index === quote.text.length

  const leftText = quote?.text.slice(0, index)
  const rightText = quote?.text.slice(index+1)
  const letter = quote?.text[index]

  useEffect(() => {
    getQuoteOfTheDay().then((quote) => setQuote(quote))
  }, [])

  useEffect(() => {
    if (quote && getStarted()) {
      setIndex(quote.text.length)
    } 
  }, [quote])

  const onKeyPressed = useCallback(({ key }: { key: string }) => {
    if (key === letter) {
      if (!interval.current) {
        interval.current = {
          interval: setInterval(onTimerUpdate, 100),
          startTime: new Date(),
        }
        setStarted()
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
  }, [letter, quote])

  useEffect(() => {
    window.addEventListener("keydown", onKeyPressed)
    return () => {
      window.removeEventListener("keydown", onKeyPressed)
    };
  }, [onKeyPressed]);

  const onTimerUpdate = (finish = false) => {
    const startTime = interval.current!.startTime
    const currentTime = new Date()
    let difference = moment(moment(currentTime).diff(startTime)).format('mm:ss:S')
    setTimer(difference)

    if (finish) {
      setScoreOfTheDay(difference)
    }
  }

  const onShare = () => {
    navigator.share({
      title: 'Quicky',
      text: `Isi pisi (${isMobile ? 'mobile' : 'pc'}): ${timer}`,
      url: 'www.google.com',
    })
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
    onShare,
  }
}
