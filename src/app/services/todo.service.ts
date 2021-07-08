import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Todo } from 'src/app/models/Todo';
import { TodoCustom } from 'src/app/models/TodoCustom';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  public base_url = environment.CUSTOM_API_BASE_URL;

  constructor(private httpClient: HttpClient) { }

  getAllTodos() {
    const url = `${this.base_url}/todos/`;
    return this.httpClient.get<Todo[]>(url);
  }

  getAllTodosPagination() {
    const url = `${this.base_url}/todos/page/`;
    return this.httpClient.get<any>(url);
  }

  getAllTodosCustom() {
    const url = `${this.base_url}/todos/`;
    return this.httpClient.get<TodoCustom[]>(url);
  }

  getTodoByUserId(id:number) {
    const url = `${this.base_url}/todos?userId=${id}/`;
    return this.httpClient.get<Todo[]>(url);
  }

  getTodoById(id:number) {
    const url = `${this.base_url}/todos/${id}/`;
    return this.httpClient.get<Todo>(url);
  }

  createTodo(todo:Todo) {
    const url = `${this.base_url}/todos/`;
    return this.httpClient.post<Todo>(url, todo);
  }

  editTodo(todo:Todo) {
    const url = `${this.base_url}/todos/${todo.id}/`;
    return this.httpClient.put<Todo>(url, todo);
  }

  deleteTodo(id:number) {
    const url = `${this.base_url}/todos/${id}/`;
    return this.httpClient.delete<Todo>(url);
  }


}
