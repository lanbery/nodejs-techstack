export function isWxbs() {
  if (!navigator || !navigator.userAgent) return false
  const ua = navigator.userAgent.toLowerCase()
  var isWeixin = ua.indexOf('micromessenger') != -1
  if (isWeixin) {
    return true
  } else {
    return false
  }
}
