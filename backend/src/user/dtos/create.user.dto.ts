    export class CreateUserDto {
        username: string;
        email: string;
        password_hash: string;
        created_at: Date;
    }

    export class FindUserDto {
        id: number;
        username: string;
        email: string;
    }