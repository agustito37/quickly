import { FaShareAlt } from "react-icons/fa";
import './styles.scss'
import { useGame } from "./use-game";

export const Game = () => {
  const { 
    quote,
    letter,
    leftText,
    rightText,
    timer,
    notStarted,
    hasFinished,
    onShare,
   } = useGame()

  const strongHighlightedClass = letter === ' ' ? 'highlight' : ''
  const strongColoredClass = hasFinished ? '' : 'colored'
  const timerColoredClass = hasFinished ? 'colored' : ''

  return (
    <section className='screen'>
      <h1>Quicky</h1>
      <p className={`timer ${timerColoredClass}`}>{timer}</p>
      <p className='text'>
        {leftText}
        <span className={`letter ${strongHighlightedClass} ${strongColoredClass}`}>{letter}</span>
        {rightText}
      </p>
      <p className='author'>- {quote?.author} -</p>
      {notStarted && (
        <p className='guide'>Type the first letter to start</p>
      )}
      {hasFinished && <FaShareAlt className='share' size={40} onClick={onShare} />}
    </section>
  )
}
