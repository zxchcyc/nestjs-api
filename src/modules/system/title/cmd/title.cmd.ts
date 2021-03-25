import { Title } from '../schemas/title.schema';

export class TitleCmd {
  constructor(data: Title | any) {
    this.name = data.name;
    this.describe = data.describe;
    this.pid = data.pid;
  }
  name: string;
  describe: string;
  pid: string;
}
