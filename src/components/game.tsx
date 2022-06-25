import moment from 'moment'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FaShareAlt } from "react-icons/fa";
import './game.scss'

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'

interface Timer {
  interval: NodeJS.Timer,
  startTime: Date,
}

const isMobile = ('ontouchstart' in document.documentElement);

export const Game = () => {
  const [quote, setQuote] = useState<{ text: string, author: string }>()
  const [index, setIndex] = useState(0)
  const interval = useRef<Timer>()
  const [timer, setTimer] = useState('00:00:0');
  
  const leftPart = quote?.text.slice(0, index)
  const rightPart = quote?.text.slice(index+1)
  const letter = quote?.text[index]

  const notStarted = !quote || index === 0
  const hasFinished = quote && index === quote.text.length

  const onTimerUpdate = () => {
    const startTime = interval.current!.startTime
    const currentTime = new Date()
    let difference = moment(moment(currentTime).diff(startTime)).format('mm:ss:S')
    setTimer(difference)
  }

  const onShare = () => {
    navigator.share({
      title: 'Quicky',
      text: `Isi pisi on my ${isMobile ? 'mobile' : 'pc'}: ${timer}`,
      url: 'www.google.com',
    })
  }

  const onKeyPressed = useCallback(({ key }: { key: string }) => {
    if (key === letter) {
      if (!interval.current) {
        interval.current = {
          interval: setInterval(onTimerUpdate, 100),
          startTime: new Date(),
        }
      }

      setIndex((i) => {
        const newIndex = i + 1
        if (newIndex === quote?.text.length) {
          onTimerUpdate()
          clearInterval(interval.current!.interval)
        }
        return newIndex
      })
    }
  }, [letter, quote])

  useEffect(() => {
    fetch("https://type.fit/api/quotes").then(async (response) => {
      const data = await response.json()
      setQuote(data[moment(new Date()).dayOfYear()])
    })
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", onKeyPressed)
    return () => {
      window.removeEventListener("keydown", onKeyPressed)
    };
  }, [onKeyPressed]);

  return (
    <section className='screen'>
      <h1>Quicky</h1>
      <p className={`timer ${hasFinished ? 'colored' : ''}`}>{timer}</p>
      <p className='text'>
        {leftPart}
        <strong className={letter === ' ' ? 'highlight' : undefined}>{letter}</strong>
        {rightPart}
      </p>
      <p className='author'>- {quote?.author} -</p>
      {notStarted && (
        <p className='guide'>Type the first letter to start</p>
      )}
      {hasFinished && <FaShareAlt className='share' size={40} onClick={onShare} />}
    </section>
  )
}
