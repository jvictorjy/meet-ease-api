import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { RoleName } from '@app/auth/infrastructure/roles/roles.enum';

export class CreateProfileDto {
  @ApiProperty({
    type: String,
    description: 'The name of the profile',
    example: faker.lorem.word(),
  })
  name: string;

  @ApiProperty({
    description: 'The role of the profile',
    enum: RoleName,
    example: RoleName.ADMIN,
  })
  role: RoleName;

  @ApiPropertyOptional({
    description: 'The description of the profile',
    example: faker.lorem.lines(),
    nullable: true,
  })
  description?: string;
}

// /**
//  * DTO for updating an existing profile
//  */
// export class UpdateProfileDto {
//   @ApiPropertyOptional({
//     description: 'The name of the profile',
//     example: 'Admin User',
//   })
//   @IsString()
//   @IsOptional()
//   name?: string;
//
//   @ApiPropertyOptional({
//     description: 'The role of the profile',
//     enum: UserRole,
//     example: UserRole.EDITOR,
//   })
//   @IsEnum(UserRole)
//   @IsOptional()
//   role?: UserRole;
//
//   @ApiPropertyOptional({
//     description: 'The description of the profile',
//     example: 'This is the administrator profile with full access',
//     nullable: true,
//   })
//   @IsString()
//   @IsOptional()
//   description?: string | null;
// }
//
// /**
//  * DTO for profile response data
//  */
// export class ProfileResponseDto {
//   @ApiProperty({
//     description: 'The unique identifier of the profile',
//     example: '123e4567-e89b-12d3-a456-426614174000',
//   })
//   @IsUUID()
//   id: string;
//
//   @ApiProperty({
//     description: 'The name of the profile',
//     example: 'Admin User',
//   })
//   @IsString()
//   name: string;
//
//   @ApiProperty({
//     description: 'The role of the profile',
//     enum: UserRole,
//     example: UserRole.ADMIN,
//   })
//   @IsEnum(UserRole)
//   role: UserRole;
//
//   @ApiPropertyOptional({
//     description: 'The description of the profile',
//     example: 'This is the administrator profile with full access',
//     nullable: true,
//   })
//   @IsString()
//   @IsOptional()
//   description: string | null;
//
//   @ApiProperty({
//     description: 'The date when the profile was created',
//     example: '2023-01-01T00:00:00Z',
//   })
//   @IsDate()
//   @Type(() => Date)
//   created_at: Date;
//
//   @ApiProperty({
//     description: 'The date when the profile was last updated',
//     example: '2023-01-01T00:00:00Z',
//   })
//   @IsDate()
//   @Type(() => Date)
//   updated_at: Date;
// }
//
// /**
//  * DTO for filtering profiles in queries
//  */
// export class FilterProfileDto {
//   @ApiPropertyOptional({
//     description: 'Filter profiles by name (partial match)',
//     example: 'admin',
//   })
//   @IsString()
//   @IsOptional()
//   name?: string;
//
//   @ApiPropertyOptional({
//     description: 'Filter profiles by role',
//     enum: UserRole,
//     example: UserRole.ADMIN,
//   })
//   @IsEnum(UserRole)
//   @IsOptional()
//   role?: UserRole;
// }
//
// /**
//  * DTO for assigning multiple roles to a profile
//  */
// export class AssignRolesDto {
//   @ApiProperty({
//     description: 'Array of roles to assign to the profile',
//     enum: UserRole,
//     isArray: true,
//     example: [UserRole.ADMIN, UserRole.EDITOR],
//   })
//   @IsArray()
//   @IsEnum(UserRole, { each: true })
//   roles: UserRole[];
// }
