import './style.scss';
import {
    routes as app
} from './routes';

import {
    setup as event_setup
}
from './controller/event'
event_setup()
app.setup()