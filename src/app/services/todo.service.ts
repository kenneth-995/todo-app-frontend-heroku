import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TodoCustom } from 'src/app/models/TodoCustom';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  public base_url = environment.CUSTOM_API_BASE_URL;

  constructor(private httpClient: HttpClient) { }

  getAllTodos() {
    const url = `${this.base_url}todos`;
    const headers = new HttpHeaders()
    .append('Access-Control-Allow-Origin', '')
    .append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    .append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    return this.httpClient.get<TodoCustom[]>(url, {headers});
  }

  getTodosPagination(page:number, size:number) {
    const url = `${this.base_url}/todos/page/?page=${page}&size=${size}`;
    return this.httpClient.get<any>(url);
  }

  getAllTodosCustom() {
    const url = `${this.base_url}/todos/`;
    return this.httpClient.get<TodoCustom[]>(url);
  }

  getTodoByUserId(id:number) {
    const url = `${this.base_url}/todos/userid/${id}/`;
    return this.httpClient.get<TodoCustom[]>(url);
  }

  getTodosPaginationByUrl(url: string){
    return this.httpClient.get(url,{ observe: 'response'});
  }

  getTodoById(id:number) {
    const url = `${this.base_url}/todos/${id}/`;
    return this.httpClient.get<TodoCustom>(url);
  }
  
  createTodo(todo:TodoCustom) {
    const url = `${this.base_url}/todos/`;
    return this.httpClient.post<TodoCustom>(url, todo);
  }

  editTodo(todo:TodoCustom) {
    const url = `${this.base_url}/todos/${todo.id}/`;
    return this.httpClient.put<TodoCustom>(url, todo);
  }

  deleteTodo(id:number) {
    const url = `${this.base_url}/todos/${id}/`;
    return this.httpClient.delete(url);
  }


}
