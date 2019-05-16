import axios from "axios";
import { BootFunction } from "./boot.types";

const bootFunction: BootFunction = ({ Vue }) => {
  Vue.prototype.$axios = axios;
};

export default bootFunction;
