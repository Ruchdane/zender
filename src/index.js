import "./style.scss";
import { routes  } from "./routes";

import { setup as eventSetup } from "./controller/event";
eventSetup();
routes.setup();
