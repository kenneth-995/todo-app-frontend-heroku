import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from 'src/app/services/todo.service';
import { UserService } from 'src/app/services/user.service';
import { TodoCustom } from 'src/app/models/TodoCustom';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  private destroy$ = new Subject();
  public titleTemplate: string = '';
  private id: any = null; //id todo pass by url

  private todo: TodoCustom = new TodoCustom;
  public isSubmitted: boolean = false;
  public isCreate: boolean = false;

  public todoForm:FormGroup;

  public users: User[] = [];

  constructor(private activateRoute: ActivatedRoute,
    private todoService: TodoService,
    private userService: UserService) { }

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

    this.inicializeForm();
    this.getUsers();
    
  }

  private getTodo(id:number) {
    this.todoService.getTodoById(id).pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom)=> {
        this.todo = res;
        this.setFormTodo(this.todo);
      }
    );
  }

  private setFormTodo(todo:TodoCustom) {
    this.todoForm.controls['id'].setValue(todo.id);
    this.todoForm.controls['userId'].setValue(todo.user.id);
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
    }
  }

  private createTodo(todo:TodoCustom) {
    this.todoService.createTodo(todo).pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom)=> {
        console.log(res);
      }
    );
  }

  private editTodo(todo:TodoCustom){
    this.todoService.editTodo(todo).pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom)=> {
        console.log(res);
      }
    );
  }

  private inicializeForm() {
    this.todoForm = new FormGroup({
      id: new FormControl(
        this.todo.id, 
        [
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.minLength(1),
        ]
      ),
      userId: new FormControl(
        this.todo.user.id, 
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
  }

  get registerFormControl() {
    return this.todoForm.controls;
  }

  private getUsers() {
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe(
      (res: User[])=> {
          this.users = res;
          console.log(res)
          console.log(this.users)
      }
    );
  }

  public onChangeSelect(value:any){
    console.log(value)
    this.todoForm.controls['userId'].setValue(value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
