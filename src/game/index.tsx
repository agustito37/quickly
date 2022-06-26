import { FaShareAlt } from "react-icons/fa";
import { RWebShare } from "react-web-share";
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
    onMobileKeyboardShow,
    mobileInputRef,
    onMobileChange,
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
      {isMobile && <input className='hidden-writable-input' ref={mobileInputRef} onChange={onMobileChange} />}
      {Boolean(quote?.author) && <p className='author'>- {quote?.author} -</p>}
      {!isMobile && notStarted && <p className='guide'>Type the first letter to start</p>}
      {isMobile && !hasFinished && <button className='guide' onClick={onMobileKeyboardShow}>Tap here to write</button>}
      {hasFinished && (
        <RWebShare
          data={{
            title: 'Quickly game',
            text: `Isi pisi (${isMobile ? 'mobile' : 'pc'}): ${timer}`,
          }}
        >
          <FaShareAlt className='share' size={40} />
        </RWebShare>
      )}
    </section>
  )
}