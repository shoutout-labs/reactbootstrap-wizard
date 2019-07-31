module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'reactbootstrap-wizard',
      externals: {
        react: 'React'
      }
    }
  }
}
