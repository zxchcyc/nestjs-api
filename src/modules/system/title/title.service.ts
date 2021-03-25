import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMongoService, IdDto } from '../../../common';
import { Title } from './schemas/title.schema';
import { TitleDto } from './dto/title.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class TitleService extends BaseMongoService<Title> {
  constructor(
    @InjectModel(Title.name)
    private readonly titleModel: Model<Title>,
  ) {
    super(titleModel, TitleService.name);
  }

  async create(data: TitleDto): Promise<Title> {
    let isExist = await this.findOne({ name: data.name });
    if (isExist) {
      throw new BadRequestException('A0133');
    }
    return super.create(data);
  }

  async isHasChild(id: IdDto): Promise<Boolean> {
    let isExist = await this.findOne({ pid: new ObjectId(id.toString()) });
    if (isExist) {
      throw new BadRequestException('A0134');
    }
    return true;
  }

  async update(id: IdDto, data: TitleDto): Promise<Title> {
    let isExist = await this.findOne({
      name: data.name,
      _id: {
        $ne: id,
      },
    });
    if (isExist) {
      throw new BadRequestException('A0133');
    }
    return super.update(id, data);
  }

  async findById(id: IdDto): Promise<Title> {
    const result = await super.findById(id);
    if (!result) {
      throw new BadRequestException('A0136');
    }
    return result;
  }
}
