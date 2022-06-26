export const isMobile = ('ontouchstart' in document.documentElement)

export const getCustomChallengeParam = () => new URLSearchParams(window.location.search).get("challenge")
export const getCustomAuthorParam = () => new URLSearchParams(window.location.search).get("author")
