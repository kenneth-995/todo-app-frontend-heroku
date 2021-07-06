import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { isEmpty, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/Todo';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  private destroy$ = new Subject();

  public todos: Todo[] = [];
  public todosTemp: Todo[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getAllTodos();
  }

  private getAllTodos() {
    this.todoService.getAllTodos().pipe(takeUntil(this.destroy$)).subscribe(
      (res:Todo[])=> {
        this.todos = res;
        this.todosTemp = res;
      }
    );
  }

  public findTodoByUserId(userId:any){

    if (userId.value.length === 0) {
      this.todos = this.todosTemp;
    }

    if (! this.checkIsId(userId.value) ) {
      return;
    } 


    this.todoService.getTodoByUserId(Number(userId.value)).pipe(takeUntil(this.destroy$)).subscribe(
      (res:Todo[])=> {
        this.todos = res;
      }
    );
  }

  private checkIsId(param:string):boolean {
    const reg = new RegExp('^[0-9]+$');
    return reg.test(param) && Number(param) > 0 ;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
