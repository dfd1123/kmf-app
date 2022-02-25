export {};

declare global {
  interface Window {
    myJs?: any;
    webkit?: any;
  }
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      VITE_BASE_URL: string;
      VITE_APP_TITLE: string;
      VITE_STORAGE_URL: string;
      VITE_API_URL: string;
    }

    interface Process {
      env: ProcessEnv;
    }
  }
}
