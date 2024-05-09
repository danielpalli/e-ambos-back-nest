import { IsArray, IsEnum, IsString, Length } from 'class-validator';
import { GenderList, SizesList } from '../enums';
import { ModelsList } from '../enums/models.enum';

export class CreateProductDto {
  @IsEnum(ModelsList)
  public model: string;
  @IsEnum(GenderList)
  public gender: string;
  @IsEnum(SizesList)
  public sizeAmbo: string;
  @IsString({ each: true })
  @IsArray()
  public colourAmbo: string[];
  @IsEnum(SizesList)
  public sizePants: string;
  @IsString({ each: true })
  @IsArray()
  public colourPants: string[];
  @IsString()
  @Length(5, 255)
  public details: string;
}