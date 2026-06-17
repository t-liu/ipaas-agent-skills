import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faLinkedin,
  faTwitter,
  faGithub,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faArrowUpRightFromSquare, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'

// Font Awesome icons
library.add(
  faLinkedin,
  faTwitter,
  faGithub,
  faInstagram,
  faEnvelope,
  faArrowUpRightFromSquare,
  faSun,
  faMoon
)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
