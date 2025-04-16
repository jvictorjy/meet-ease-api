import { Controller, Post, Body } from '@nestjs/common';
import { CreateProfileUseCase } from '@app/profiles/application/use-cases/create-profiele.use-case';

@Controller('profiles')
export class CreateProfileController {
  constructor(private readonly createProfileUseCase: CreateProfileUseCase) {}

  @Post()
  async handle(
    @Body() body: { userId: string; role: string; description: string | null },
  ) {
    return this.createProfileUseCase.execute(body.role, body.description);
  }
}
