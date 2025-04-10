import { CreateUserDto } from "../dtos/create-user.dto";
import { FindUserDto } from "../dtos/find-user.dto";

export interface IUserRepository {
    createUser(data: CreateUserDto): Promise<void>;
    updateUser(id: number, data:CreateUserDto): Promise<void>;
    deleteUser(id: number): Promise<void>;
    findUserById(id: number): Promise<FindUserDto | null>;
    findAllUsers(): Promise<FindUserDto[]>;
    findUserByEmail(email: string): Promise<CreateUserDto | null>;
    existsByEmailOrUsername(email: string, username?: string): Promise<boolean>;
}