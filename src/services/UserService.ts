import {
  FindIdInput,
  GetUserListRequest,
  ProfileInput,
  PwChangeInput,
  RegisterInput,
  ResetPwInput,
  SendResetPasswordEmailInput,
} from './types/User';
import { ConstructorParamsType } from './types/Service';
import { setAuth } from '@/store/auth/auth';
import { setPushAlarm } from '@/utils/notificationUtil';

class UserService {
  #api;
  #cookie;
  #dispatch;

  constructor({ api, cookie, dispatch }: ConstructorParamsType) {
    this.#api = api;
    this.#cookie = cookie;
    this.#dispatch = dispatch;
  }

  async emailLogin(body: { email: string; password: string }) {
    const result = await this.#api.post('/login', body);

    if (result.access_token) {
      this.#dispatch(setAuth(result));
      this.#cookie.setAccessToken(result.access_token);

      setPushAlarm({ isOn: result.user.flag_alarm !== 0 });
    }

    return result;
  }

  async register(body: RegisterInput) {
    const result = await this.#api.post('/register', body);

    if (result.access_token) {
      this.#cookie.setAccessToken(result.access_token);
    }

    return result;
  }

  async logout() {
    await this.#api.post('/logout');
    this.#dispatch(setAuth({}));
    this.#cookie.removeAccessToken();
  }

  findId(body: FindIdInput) {
    return this.#api.post('/find_id', body);
  }

  sendResetPasswordEmail(body: SendResetPasswordEmailInput) {
    return this.#api.post('find_pw', body);
  }

  resetPw(body: ResetPwInput) {
    return this.#api.post('reset_pw', body);
  }

  pwChange(body: PwChangeInput) {
    return this.#api.put('/user/password', body);
  }

  async getMyInfo() {
    const user = await this.#api.get('/profile');
    const access_token = this.#cookie.getAccessToken();
    setPushAlarm({ isOn: user.flag_alarm !== 0 });
    this.#dispatch(setAuth({ user: user, access_token: access_token }));
  }

  getUser(params: { id?: string }) {
    if (!params.id) return;
    return this.#api.get('/user/view', params);
  }

  getUserList(params: GetUserListRequest) {
    return this.#api.get('/user/list', params);
  }

  async modifyProfile(body: ProfileInput) {
    const frm = new FormData();
    frm.append('_method', 'put');
    for (const [key, value] of Object.entries(body)) {
      frm.append(key, value);
      if (key === 'profile_img') {
        frm.append('profile_img[]', value);
      }
    }
    const user = await this.#api.post('/user/update', frm, {
      headers: {
        'Content-type': 'application/json; multipart/form-data;',
      },
    });
    const auth = {
      user: user,
      access_token: this.#cookie.getAccessToken(),
    };

    this.#dispatch(setAuth(auth));
  }
}

export default UserService;
