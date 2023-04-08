import { Transform } from 'class-transformer';

export class ResponsePresalePlatformDto {
  @Transform((value) => value?.obj?._id?.toString())
  _id: string;

  name: string;

  logo: string;
}
