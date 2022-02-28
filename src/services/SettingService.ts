import { ConstructorParamsType } from './types/Service';

class SettingService {
  #api;
  #cookie;
  #dispatch;

  constructor({ api, cookie, dispatch }: ConstructorParamsType) {
    this.#api = api;
    this.#cookie = cookie;
    this.#dispatch = dispatch;
  }

  getSetting() {
    return this.#api.get('/setting/view');
  }
}

export default SettingService;
