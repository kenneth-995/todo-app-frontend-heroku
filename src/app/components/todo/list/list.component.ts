import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';
import { TodoService } from 'src/app/services/todo.service';
import { TodoCustom } from 'src/app/models/TodoCustom';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild("modalDelete", { static: false }) modalDelete: TemplateRef<any>;

  private destroy$ = new Subject();

  public currentUserId: string;

  public todoCustom: TodoCustom[] = [];
  public todoCustomTemp: TodoCustom[] = [];
  
  public numberPages: Array<number>;//Array to loop for in html template and show pagination

  public isPagination: boolean = false;
  public currentPage: number = 0;
  private lastPage: number = 0;
  private sizePage: number = 10;

  constructor(private todoService: TodoService, 
    private userService: UserService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getAllTodosCustom();
    this.setCurrentuserId();
  }

  private getAllTodosCustom() {
    this.todoService.getAllTodosCustom().pipe(takeUntil(this.destroy$)).subscribe(
      (res:TodoCustom[])=> {
        this.todoCustom = res;
        this.todoCustomTemp = res;
      }
    );
  }

  public findTodoByUserId(userId:string){

    if (userId.length === 0 || Number(userId) === 0) {
      this.todoCustom = this.todoCustomTemp;
    }

    if (! this.checkIsId(userId) ) {
      this.todoCustom = this.todoCustomTemp;
      return;
    } 

    this.todoService.getTodoByUserId(Number(userId)).pipe(takeUntil(this.destroy$)).subscribe(
      (res:any)=> {
        console.log(res)
        this.todoCustom = res;
        this.todoCustomTemp = res;
      },
      (error) => {
        if (error["status"] == 404){
          this.todoCustom = [];//todos not fount
        }
        
      }
    );
  }

  private getTodosPagination(page:number, size:number) {
    this.todoService.getTodosPagination(page, size).pipe(takeUntil(this.destroy$)).subscribe(
      (res:any)=> {
        this.todoCustom = res['content'];
        this.todoCustomTemp = res['content'];
      },
      (error) => {
        if (error["status"] == 404){
          this.todoCustom = [];
        }
      }
    );
  }

  private getFirstTimeTodosPagination() {
    this.todoService.getTodosPagination(0, this.sizePage).pipe(takeUntil(this.destroy$)).subscribe(
      (res:any)=> {
        this.todoCustom = res['content'];
        this.todoCustomTemp = res['content'];
        this.lastPage= res['totalPages']-1;
        this.numberPages = new Array<number>(res['totalPages']);//Array to be able to do for loop in html template        
      },
      (error) => {
        if (error["status"] == 404){
          this.todoCustom = [];
        }
        
      }
    );
  }

  private getTodoItemsPagination(page:number= this.lastPage) {
    this.currentPage= page;
    this.getTodosPagination(page, this.sizePage);
  }

  public showPagination() {
    if (!this.isPagination){
      this.getFirstTimeTodosPagination();
    } else {
      this.getAllTodosCustom();
    }
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

  private deleteTodo(id:number, idx:number){
    this.todoService.deleteTodo(id).pipe(takeUntil(this.destroy$)).subscribe(
      ()=> {
        this.todoCustom.splice(idx, 1);
        this.todoCustomTemp.splice(idx, 1);
      }
    );
  }

  private checkIsId(param:string):boolean {
    const reg = new RegExp('^[0-9]+$');
    return reg.test(param) && Number(param) > 0 ;
  }

  private setCurrentuserId(){
    this.currentUserId= this.userService.getUserId;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
