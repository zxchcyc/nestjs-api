import { ObjectID } from 'mongodb';

export class DeleteCmd {
  constructor(data: any) {
    this.isDeleted = true;
    this.id = data.id;
  }
  isDeleted: boolean;
  id: ObjectID;
}

export class UpdateCmd {
  constructor(data: any) {
    this.isUpdated = true;
    this.id = data.id;
  }
  isUpdated: boolean;
  id: ObjectID;
}

export class CreateCmd {
  constructor(data: any) {
    this.isCreated = true;
    this.id = data.id;
  }
  isCreated: boolean;
  id: ObjectID;
}