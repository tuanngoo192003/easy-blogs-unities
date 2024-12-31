import './styles.css';
import { createApp } from 'vue';
import App from './app/App.vue';
import {Quasar} from 'quasar';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {setupStore} from "./store";
import router from "./router";

const app = createApp(App);

setupStore(app)
app.use(Quasar, {
    plugins: {}
})
app.use(router)
app.component('FontAwesomeIcon', FontAwesomeIcon)
app.mount('#root');
