import Vuelidate from "vuelidate";
import { BootFunction } from "./boot.types";

const bootFunction: BootFunction = async ({ Vue }) => {
  Vue.use(Vuelidate);
};

export default bootFunction;
