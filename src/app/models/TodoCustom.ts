import { User } from 'src/app/models/User';
export class TodoCustom {
    id: number;
    title: string;
    user: User;
    completed: boolean;
}