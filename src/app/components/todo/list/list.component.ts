import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { isEmpty, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoService } from 'src/app/services/todo.service';
import { Todo } from 'src/app/models/Todo';

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

  constructor(private todoService: TodoService, private modalService: NgbModal,) { }

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
