import { User } from "src/users/schemas/user.schema";

export class AuthResponse {
    token: string;
    user: User;
}