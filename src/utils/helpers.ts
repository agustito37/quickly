export const isMobile = ('ontouchstart' in document.documentElement)

export const getCustomGameParam = () => new URLSearchParams(window.location.search).get("customGame")
