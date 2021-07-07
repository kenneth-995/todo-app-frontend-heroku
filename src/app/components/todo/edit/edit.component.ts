import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Todo } from 'src/app/models/Todo';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  private destroy$ = new Subject();
  private id: any = null;
  private todo: Todo = new Todo;
  public isSubmitted: boolean = false;
  public isCreate: boolean = false;

  public titleTemplate: string = '';


  public todoForm = new FormGroup({
    id: new FormControl(
      this.todo.id, 
      [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(1),
      ]
    ),
    userId: new FormControl(
      this.todo.userId, 
      [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ]
    ),
    title: new FormControl(
      this.todo.title, 
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200),
      ]),
    completed: new FormControl(
      this.todo.completed, 
      [
        Validators.required
      ]),
  });

  constructor(private activateRoute: ActivatedRoute,
    private todoService: TodoService) { }

  ngOnInit(): void {

    this.activateRoute.paramMap.subscribe( param => {
      this.id = param.get('id');
      
      if (this.id) {
        this.getTodo(this.id);
        this.titleTemplate = "Edit TODO"
        
      } else {
        this.titleTemplate = "Create TODO"
        this.isCreate= true;
      }  
    });

  }

  private getTodo(id:number) {
    this.todoService.getTodoById(id).pipe(takeUntil(this.destroy$)).subscribe(
      (res:Todo)=> {
        this.todo = res;
        this.setFormTodo(this.todo);
      }
    );
  }

  private setFormTodo(todo:Todo) {
    this.todoForm.controls['id'].setValue(todo.id);
    this.todoForm.controls['userId'].setValue(todo.userId);
    this.todoForm.controls['title'].setValue(todo.title);
    this.todoForm.controls['completed'].setValue(todo.completed);
  }

  public saveForm() {
    if(this.todoForm.valid) { //todo: check user id > 0

      if (this.isCreate) {
        this.createTodo(this.todoForm.value);
        
      } else {
        this.editTodo(this.todoForm.value);
      }
      console.log(this.todoForm.value);
      
    }
    
  }

  private createTodo(todo:Todo) {
    this.todoService.createTodo(todo).pipe(takeUntil(this.destroy$)).subscribe(
      (res:Todo)=> {
        console.log(res);
      }
    );
  }

  private editTodo(todo:Todo){
    this.todoService.editTodo(todo).pipe(takeUntil(this.destroy$)).subscribe(
      (res:Todo)=> {
        console.log(res);
      }
    );
  }

  get registerFormControl() {
    return this.todoForm.controls;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
