import moment from "moment";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCustomAuthorParam, getCustomChallengeParam } from "../utils/helpers";
import { getQuoteOfTheDay, getScoreOfTheDay, getStarted, Quote, setScoreOfTheDay, setStarted } from "../utils/storage";

interface Timer {
  interval: NodeJS.Timer,
  startTime: Date,
}

const DEFAULT_TIMER = '00:00:0'

export const useGame = () => {
  const [isCustomChallenge, setIsCustomChallenge] = useState(false)
  const [customQuote, setCustomQuote] = useState<Quote>({ text: '', author: '' })
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

  useEffect(() => {
    initGame()
  }, [])

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


    const timer = getScoreOfTheDay(quote) ?? DEFAULT_TIMER
    setTimer(timer)

    gtag('event', customChalenge ? 'custom-challenge' : 'daily-challenge', { text: quote.text, author: quote.author })

    // if the game has already been played we finish the game
    if (quote && getStarted(quote)) {
      setIndex(quote.text.length)
      gtag('event', 'already-played', { timer })
    } 
  }

  const onStarted = useCallback(() => {
    setStarted(quote!)
    gtag('event', 'started')
  }, [quote])

  const onTimerUpdate = useCallback((finish = false) => {
    const startTime = interval.current!.startTime
    const currentTime = new Date()
    let difference = moment(moment(currentTime).diff(startTime)).format('mm:ss:S')
    setTimer(difference)

    if (finish) {
      setScoreOfTheDay(quote!, difference)
    }

    return difference
  }, [quote])

  const finishGame = useCallback(() => {
    const timer = onTimerUpdate(true)
    clearInterval(interval.current!.interval)

    gtag('event', 'finished', { timer })
  }, [onTimerUpdate])

  const onKeyPressed = useCallback(({ key }: { key: string }) => {
    if (key === letter) {
      if (!interval.current) {
        interval.current = {
          interval: setInterval(onTimerUpdate, 100),
          startTime: new Date(),
        }
      }

      setIndex((i) => {
        // game just started
        if (i === 0) {
          onStarted()
        }

        const newIndex = i + 1
        // game has finished
        if (newIndex === quote?.text.length) {
          finishGame()
        }
        return newIndex
      })
    }
  }, [finishGame, letter, onStarted, onTimerUpdate, quote])

  useEffect(() => {
    window.addEventListener("keydown", onKeyPressed)
    return () => {
      window.removeEventListener("keydown", onKeyPressed)
    };
  }, [onKeyPressed]);

  const customLink = useMemo(() => {
    if (!customQuote.text) return ''

    const customLink = window.location.href.split('?')[0]
    const url = new URL(customLink);
    url.searchParams.append('challenge', customQuote.text);

    if (customQuote.author) {
      url.searchParams.append('by', customQuote.author);
    }

    return url.toString()
  }, [customQuote])

  const onMobileKeyboardShow = () => {
    mobileInputRef.current?.focus()
  }

  const onMobileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onKeyPressed({ key: event.target.value?.[event.target.value.length-1] })
  }

  const onShare = () => {
    gtag('event', 'shared')
  }

  const onTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomQuote((customQuote) => ({ ...customQuote, text: event.target.value }))
  }

  const onAuthorChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomQuote((customQuote = { text: '' }) => ({ ...customQuote, author: event.target.value }))
  }
  
  const onCustomCopy = () => {
    navigator.clipboard.writeText(customLink)
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
    isCustomChallenge,
    onMobileKeyboardShow,
    onMobileChange,
    onShare,
    onTextChange,
    onAuthorChange,
    customLink,
    onCustomCopy,
  }
}
