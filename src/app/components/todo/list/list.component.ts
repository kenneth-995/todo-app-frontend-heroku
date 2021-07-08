import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/Todo';
import { TodoCustom } from 'src/app/models/TodoCustom';

import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild("modalDelete", { static: false }) modalDelete: TemplateRef<any>;

  private destroy$ = new Subject();

  public todos: Todo[] = [];
  public todosTemp: Todo[] = [];

  public todoCustom: TodoCustom[] = [];

  public isPagination: boolean = false;

  constructor(private todoService: TodoService, 
    private modalService: NgbModal,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getAllTodosCustom();
  }

  private getAllTodos() {
    this.todoService.getAllTodos().pipe(takeUntil(this.destroy$)).subscribe(
      (res:Todo[])=> {
        this.todos = res;
        this.todosTemp = res;
      }
    );
  }

  private getAllTodosCustom() {
    this.todoService.getAllTodosCustom().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom[])=> {
        /* this.todos = res;
        this.todosTemp = res; */
        this.todoCustom = res;
        console.log(res)
      }
    );
  }


  private getAllTodosCustomPagination() {
    this.httpClient.get<HttpResponse<any>>('http://localhost:8080/api/todos/page/').subscribe(
      (res:HttpResponse<any>)=>console.log(res.headers.keys)
    );
  }


  public findTodoByUserId(userId:string){

    if (userId.length === 0 || Number(userId) === 0) {
      this.todos = this.todosTemp;
    }

    if (! this.checkIsId(userId) ) {
      return;
    } 


    this.todoService.getTodoByUserId(Number(userId)).pipe(takeUntil(this.destroy$)).subscribe(
      (res:Todo[])=> {
        this.todos = res;
      }
    );
  }

  public deleteTodo(id:number, idx:number){
    this.todoService.deleteTodo(id).pipe(takeUntil(this.destroy$)).subscribe(
      ()=> {
        console.log('deleted');
        this.todos.splice(idx, 1);
      }
    );
  }

  private checkIsId(param:string):boolean {
    const reg = new RegExp('^[0-9]+$');
    return reg.test(param) && Number(param) > 0 ;
  }

  public openModalDelete(id:number, idx:number) {
    this.modalService.open(this.modalDelete).result.then(
      r => {
        if (r === '1') { 
          this.deleteTodo(id, idx)
        } else {
          //DISCARD DELETE
        }
      }
    );
  }

  public activePagination(value: boolean) {
    console.log(value)
    this.getAllTodosCustomPagination()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
