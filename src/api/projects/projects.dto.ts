import { ProjectPriority, ProjectStatus } from '@/schemas/project.schema';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsEmail, IsArray, IsEnum } from 'class-validator';

export class CreateProjectDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @ApiProperty({enum: ProjectStatus, default: ProjectStatus.ACTIVE})
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({enum: ProjectPriority, default: ProjectPriority.MEDIUM})
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @IsArray()
  @IsOptional()
  @ApiProperty({default: []})
  tags?: string[];
}

export class UpdateProjectDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;

  @ApiProperty({enum: ProjectStatus, default: ProjectStatus.ACTIVE})
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiProperty({enum: ProjectPriority, default: ProjectPriority.MEDIUM})
  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @IsArray()
  @IsOptional()
  @ApiProperty({default: []})
  tags?: string[];
}