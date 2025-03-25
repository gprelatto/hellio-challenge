import { ProjectPermission } from "@/schemas/user-company.schema";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsString, MaxLength } from "class-validator";

export class HandleRoleDTO {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsArray()
  @ApiProperty({default: [ProjectPermission.READ]})
  permissons?: ProjectPermission[];
}