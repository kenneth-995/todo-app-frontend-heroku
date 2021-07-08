import { User } from 'src/app/models/User';
export class TodoCustom {
    id: number = 0;
    title: string = '';
    user: User = new User;
    completed: boolean =false;
}