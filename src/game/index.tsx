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
    isCustomChallenge,
    onShare,
   } = useGame()

  const strongHighlightedClass = letter === ' ' ? 'highlight' : ''
  const strongColoredClass = hasFinished ? '' : 'colored'
  const timerColoredClass = hasFinished ? 'colored' : ''

  return (
    <section className='screen'>
      <h1 className='title'>Quickly</h1>
      <p className='legend'>{isCustomChallenge ? 'custom' : 'daily'} challenge</p>
      <p className={`timer ${timerColoredClass}`}>{timer}</p>
      {isMobile && <input className='hidden-writable-input' ref={mobileInputRef} onChange={onMobileChange} />}
      <p className='text'>
        {leftText}
        <span className={`letter ${strongHighlightedClass} ${strongColoredClass}`}>{letter}</span>
        {rightText}
      </p>
      <p className='author'>{quote?.author ? `- ${quote?.author} -` : ''}</p>
      {!isMobile && notStarted && <p className='guide'>Type the first letter to start</p>}
      {isMobile && !hasFinished && <button className='guide' onClick={onMobileKeyboardShow}>Tap here to write</button>}
      {hasFinished && (
        <RWebShare
          data={{
            title: 'Quickly: typing challenge',
            text: `Ez challenge (${isMobile ? 'mobile' : 'pc'}): ${timer}`,
          }}
          onClick={onShare}
        >
          <FaShareAlt className='share' size={40} />
        </RWebShare>
      )}
    </section>
  )
}
