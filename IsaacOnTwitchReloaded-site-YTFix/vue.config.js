module.exports = {
  publicPath: '/frontend',
  pwa: {
    name: 'Isaac On Twitch',
    themeColor: '#6441A4',
    msTileColor: '#6441A4',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    workboxOptions: {
      skipWaiting: true
    }
  }
}