import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { TodoService } from 'src/app/services/todo.service';
import { TodoCustom } from 'src/app/models/TodoCustom';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild("modalDelete", { static: false }) modalDelete: TemplateRef<any>;

  private destroy$ = new Subject();
  public errorMessage: string = '';

  public userIdLogged: number;

  public todoCustom: TodoCustom[] = [];
  public todoCustomTemp: TodoCustom[] = [];
  
  public numberPages: Array<number>;//Array to loop for in html template and show pagination
  public isPagination: boolean = false;
  private firstPage: number = 0;
  private lastPage: number = 0;
  public currentPage: number = 0;
  private sizePage: number = 10;

  public formUserId : FormGroup;

  constructor(private todoService: TodoService, 
    private userService: UserService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userIdLogged= this.userService.getUserIdLogged;
    this.getAllTodosList();
    this.inicializeFormUserId();
  }

  private getAllTodosList() {
    this.todoService.getAllTodosCustom().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom[])=> {
        this.todoCustom = res;
        this.errorMessage = "";
      },
      (error) => {
        console.log(error)
        if (error["status"] == 404){
          this.todoCustom = [];
        } else if (error["status"] == 0){
          this.errorMessage = "Service not available, please try again";
        } else {
          this.errorMessage = "Something went wrong, try again or contact the administrator";
        } 
      }
    );
  }

  private getTodosByUserId(id: number) {
    this.todoService.getTodoByUserId(Number(id)).pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom[])=> {
        this.todoCustom = res;
        this.errorMessage = "";
      },
      (error) => {
        if (error["status"] == 404){
          this.todoCustom = [];
        } else if (error["status"] == 0){
          this.errorMessage = "Service not available, please try again";
        } else {
          this.errorMessage = "Something went wrong, try again or contact the administrator";
        } 
      }
    );
  }

  private getTodosPage(page:number, size:number = 10) {
    
    this.todoService.getTodosPagination(page, size).pipe(takeUntil(this.destroy$)).subscribe(
      (res:any)=> {
        this.currentPage= page;
        this.todoCustom = res['content'] as TodoCustom[];
        this.lastPage= res['totalPages']-1 as number;
        this.numberPages = new Array<number>(res['totalPages'] as number);//Array to be able to do for loop in html template   
        this.errorMessage = "";
      },
      (error) => {
        console.log(error)
        if (error["status"] == 404){
          this.todoCustom = [];
        } else if (error["status"] == 0){
          this.errorMessage = "Service not available, please try again";
        } else {
          this.errorMessage = "Something went wrong, try again or contact the administrator";
        } 
      }
    );
  }

  public showPaginationAndGetFirstPage() {
    if ( !this.isPagination ) {
      this.formUserId.controls['id'].setValue(null);
      this.getFirstPage();
    } 
    else this.getAllTodosList();
  }

  public getFirstPage() {
    this.currentPage =this.firstPage; 
    this.getTodosPage(this.firstPage, this.sizePage);
  }

  public getLastPage() {
    this.currentPage =this.lastPage;
    this.getTodosPage(this.lastPage, this.sizePage);
  }

  public openModalDelete(id: number, idx: number) {
    this.modalService.open(this.modalDelete).result.then(
      r => {
        if (r === '1') this.deleteTodo(id, idx)
      }
    );
  }

  private deleteTodo(id: number, idx: number){
    this.todoService.deleteTodo(id).pipe(takeUntil(this.destroy$)).subscribe(
      ()=> {
        this.todoCustom.splice(idx, 1);
        this.errorMessage = "";
      },
      (error) => {
        if (error["status"] == 401){
          this.errorMessage = "You can't delete all from other users";
        } else if (error["status"] == 403){ // It shouldn't happen unless the user modifies the dom
          this.errorMessage = "You can't delete all from other users";
        } else {
          this.errorMessage = "Service not available, please try again";
        }
      }

      
    );
  }

  private inicializeFormUserId() {
    this.formUserId = new FormGroup({
      id: new FormControl()
    });

    this.formUserId.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      (field)=> {
        const id = this.formUserId.controls['id'].value
        const isGoodId =  Number(id) && Number(id) > 0;
        if (isGoodId) {
          this.isPagination = false;
          this.getTodosByUserId(id);
        } else {
          this.getAllTodosList();
        }
      }
    );
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
