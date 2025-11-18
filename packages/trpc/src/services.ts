import type { User } from "@repo/database";
import type { UpdateUserDto, UpdateUserLanguageDto } from "@repo/schemas";

export interface IAccountService {
  updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
  deleteAccount(userId: string): Promise<void>;
  updateLanguage(userId: string, data: UpdateUserLanguageDto): Promise<User>;
}
