module.exports = (isDev) => {
  return [
    {
      template: 'pages/index.pug',
      filename: 'index.html',
      title: 'pug demo'
    }, {
      template: 'pages/example.pug',
      filename: 'example.html',
      title: 'example'
    }
  ].concat(isDev ? [{
    template: 'pages/__components.pug',
    filename: '__components.html',
    title: 'components'
  }, {
    template: 'pages/__fontawesome.pug',
    filename: '__fontawesome.html',
    title: 'fontawesome'
  }] : []);
};