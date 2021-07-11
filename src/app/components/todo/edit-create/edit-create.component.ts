import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TodoService } from 'src/app/services/todo.service';
import { UserService } from 'src/app/services/user.service';
import { TodoCustom } from 'src/app/models/TodoCustom';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-edit',
  templateUrl: './edit-create.component.html',
  styleUrls: ['./edit-create.component.css']
})
export class EditCreateComponent implements OnInit {
  @ViewChild("modalCreatedEdited", { static: false }) modalCreatedEdited: TemplateRef<any>;

  private destroy$ = new Subject();
  public titleTemplate: string = '';
  public errorMessage: string = '';
  public messageModalTemplate: string = '';
  private paramUrlId: number = 0;

  private todo: TodoCustom = new TodoCustom;
  public isSubmitted: boolean = false;
  public isCreate: boolean = false;

  public todoForm: FormGroup = new FormGroup({});

  public userIdLogged: number = 0;
  public users: User[] = [];

  constructor(private activateRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private todoService: TodoService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userIdLogged= this.userService.getUserIdLogged;
    this.getParamUrl();
    this.inicializeForm();
  }

  private getParamUrl() {
    this.activateRoute.paramMap.subscribe( param => {
          
      this.paramUrlId = Number(param.get('id'));

      if (this.paramUrlId > 0) {
        this.getUser();
        this.getTodo(this.paramUrlId);
        this.titleTemplate = "Edit TODO"

      } else if (this.paramUrlId === 0) {
        this.getUsers();
        this.titleTemplate = "Create TODO"
        this.isCreate= true;

      } else this.router.navigateByUrl('/list');
            
    });
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
          Validators.maxLength(199),
        ]),
      completed: new FormControl(
        this.todo.completed, 
        [
          Validators.required
        ]),
    });
  }

  private getTodo(id:number) {
    this.todoService.getTodoById(id).pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom)=> {
        this.todo = res;
        if (this.userService.checkHasPermissionModidy(this.todo.user.id, this.userIdLogged)) {
          this.setFormTodo(this.todo);
        } else this.router.navigateByUrl('/list') // FORBIDDEN
        
      }, 
      (error) => this.router.navigateByUrl('/list')
    );
  }

  private getUsers() {
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe(
      (res: User[])=> this.users = res
      , (error) => this.errorMessage = "Service not available, please try again"
    );
  }

  private getUser() {
    this.userService.getUserById(this.userIdLogged).pipe(takeUntil(this.destroy$)).subscribe(
      (res: User)=> this.users.push(res)

      , (error) => this.errorMessage = "Service not available, please try again"
      
    );
  }

  private setFormTodo(todo:TodoCustom) {
    this.todoForm.controls['id'].setValue(todo.id);
    this.todoForm.controls['userId'].setValue(todo.user.id);
    this.todoForm.controls['title'].setValue(todo.title);
    this.todoForm.controls['completed'].setValue(todo.completed);
  }

  public saveForm() {
    this.isSubmitted = true;
    if(this.todoForm.valid) {
      if (this.isCreate) this.createTodo(this.todoForm.value);
      
      else this.editTodo(this.todoForm.value);
    }
  }

  private createTodo(todo:TodoCustom) {
    this.todoService.createTodo(todo).pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom)=> {
        this.todo = res;
        this.openModalCreatedEdited('Do you want to create another?');
      },
      (error) => {this.errorMessage = "Service not available, please try again";
      }
    );
  }

  private editTodo(todo:TodoCustom){
    this.todoService.editTodo(todo).pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom)=> {
        this.todo = res;
        this.openModalCreatedEdited('Do you want to stay here?');
        this.errorMessage = "";
      },
      (error) => {
        if (error["status"] == 401 || error["status"] == 403){
          this.router.navigateByUrl('/list');
        } else {
          this.errorMessage = "Service not available, please try again";
        }
      }
    );
  }

  public openModalCreatedEdited(msg: string) {
    this.messageModalTemplate = msg;
    this.modalService.open(this.modalCreatedEdited).result.then(
      r => {
        if (r === '0') this.router.navigateByUrl('/list');
        else { 
          this.isSubmitted = false;
        }
      }
    );
  }

  public onChangeSelectUser(value:any){
    this.todoForm.controls['userId'].setValue(value);
  }

  get registerFormControl() {
    return this.todoForm.controls;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
