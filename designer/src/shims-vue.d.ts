declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "vue/types/vue" {
  import Vue from "vue";
  import { AxiosInstance } from "axios";
  interface Vue {
    $axios: AxiosInstance;
  }
}
