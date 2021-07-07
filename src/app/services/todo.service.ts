import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Todo } from 'src/app/models/Todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  public base_url = environment.BASE_URL;

  constructor(private htttClient: HttpClient) { }

  getAllTodos() {
    const url = `${this.base_url}/todos`;
    return this.htttClient.get<Todo[]>(url);
  }

  getTodoByUserId(id:number) {
    const url = `${this.base_url}/todos?userId=${id}`;
    return this.htttClient.get<Todo[]>(url);
  }

  getTodoById(id:number) {
    const url = `${this.base_url}/todos/${id}`;
    return this.htttClient.get<Todo>(url);
  }

  createTodo(todo:Todo) {
    const url = `${this.base_url}/todos/`;
    return this.htttClient.post<Todo>(url, todo);
  }

  editTodo(todo:Todo) {
    const url = `${this.base_url}/todos/${todo.id}`;
    return this.htttClient.put<Todo>(url, todo);
  }

  deleteTodo(id:number) {
    const url = `${this.base_url}/todos/${id}`;
    return this.htttClient.delete<Todo>(url);
  }


}
