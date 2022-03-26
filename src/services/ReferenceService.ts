import { serUnreadRefList } from '@/store/notice/notice';
import { downloadFile } from '@/utils/fileUtils';
import { ConstructorParamsType } from './types/Service';

class ReferenceService {
  #api;
  #dispatch;
  #cookie;

  constructor({api, cookie, dispatch} : ConstructorParamsType) {
    this.#api = api;
    this.#dispatch = dispatch;
    this.#cookie = cookie;
  }

  getReferenceList(params: {
    searchKeyword: string;
    limit: number;
    offset: number;
  }) {
    return this.#api.get('/archive/list', params);
  }

  getReferenceDetail(params: { ar_id: number | string }) {
    const {ar_id} = params;
    const alreadyRead = this.#cookie.getHitCnt('ref', ar_id);

    if(!alreadyRead) {
      this.#cookie.setHitCnt('ref', ar_id);
      this.hitReference(params);
    }

    this.#api.put('/archive_read/read', params);


    return this.#api.get('/archive/view', params);
  };

  hitReference(body : {ar_id: number | string}){
    this.#api.put('/archive/hit', body);
  }

  async getUnreadList(){
    const result = await this.#api.get('/archive_read/list');
    this.#dispatch(serUnreadRefList(result));
  }

  async download(filePathList: string[], fileNameList: string[], index: number = 0){
    if(filePathList[index]){
      window.open(`${import.meta.env.VITE_API_URL}/download?download_url=${filePathList[index]}&download_filename=${fileNameList[index]}`);
    }
  }
}

export default ReferenceService;
