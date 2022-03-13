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

  async download(filePathList: string[], index: number = 0){
    if(filePathList[index]){
      const fileArr = filePathList[index].split('/');
      const name = fileArr[fileArr.length - 1];

      const result = await this.#api.get('/archive/download', {filepath : filePathList[index]}, {image: true});

      downloadFile(result, name);
    }
  }
}

export default ReferenceService;
