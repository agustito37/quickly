import { FaShareAlt } from "react-icons/fa";
import { isMobile } from "../utils/helpers";
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
    onMobileKeyboardShow,
    mobileInputRef,
   } = useGame()

  const strongHighlightedClass = letter === ' ' ? 'highlight' : ''
  const strongColoredClass = hasFinished ? '' : 'colored'
  const timerColoredClass = hasFinished ? 'colored' : ''

  return (
    <section className='screen'>
      <h1>Quickly</h1>
      <p className={`timer ${timerColoredClass}`}>{timer}</p>
      <p className='text'>
        {leftText}
        <span className={`letter ${strongHighlightedClass} ${strongColoredClass}`}>{letter}</span>
        {rightText}
      </p>
      <p className='author'>- {quote?.author} -</p>
      {!isMobile && notStarted && (
        <p className='guide'>Type the first letter to start</p>
      )}
      {isMobile && (
        <>
          <button className='guide' onClick={onMobileKeyboardShow}>Tap here to start</button>
          <input ref={mobileInputRef} type='text' style={{ width: 0, height: 0, visibility: 'hidden' }} />
        </>
      )}
      {hasFinished && <FaShareAlt className='share' size={40} onClick={onShare} />}
    </section>
  )
}
