import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.9.1/dist/module.esm.js'
import urlParse from './modules/url-parse.js'

document.addEventListener('alpine:init', () => {
  Alpine.data('app', () => ({
    format: '',
    url: '',
    result: '',

    loadExample() {
      this.format = '/:version/api/:collection/:id'
      this.url = '/6/api/listings/3?sort=desc&limit=10'
      this.parse()
    },

    parse() {
      this.result = JSON.stringify(urlParse(this.format, this.url), null, ' ')
    }
  }))
})

Alpine.start()
