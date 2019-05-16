type BootObject = {
  app: any;
  router: any;
  store: any;
  Vue: any;
  ssrContext: any;
};

export type BootFunction = (args: BootObject) => void;
