export const isMobile = ('ontouchstart' in document.documentElement)

export const getCustomChallengeParam = () => new URLSearchParams(window.location.search).get("challenge")
export const getCustomAuthorParam = () => new URLSearchParams(window.location.search).get("by")

export const hashCode = (str: string) => {
  let hash = 0
  for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
  }
  return hash
}
