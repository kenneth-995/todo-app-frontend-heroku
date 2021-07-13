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

  public formUserId : FormGroup;

  public todoCustom: TodoCustom[] = [];
  public todoCustomTemp: TodoCustom[] = [];
  
  //TODO: MOVE IT TO A CLASS 'utils pagination'
  private FIRST_PAGE: number = 0;
  private SIZE_PAGE: number = 10;
  public numberPages: Array<number>;//Array to loop for in html template and show pagination
  public isPagination: boolean = false;
  public currentPage: number = 0;
  public linksPagination = {};

  constructor(private todoService: TodoService, 
    private userService: UserService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userIdLogged= this.userService.getUserIdLogged;
    this.getAllTodosList();
    this.inicializeFormUserId();
  }


  // param = 'next' || 'prev' || 'first' || 'last'
  public getPageByLink(param: string) {

    //change the parameter for the useful url
    if (param === 'first') {
      param = this.linksPagination['first']
      this.currentPage = this.FIRST_PAGE;

    } else if (param === 'prev') {
      param = this.linksPagination['prev']
      this.currentPage -= 1;

    } else if (param === 'next') {
      param = this.linksPagination['next']
      this.currentPage += 1;

    } else if (param === 'last') {
      param = this.linksPagination['last']
      this.currentPage = this.numberPages.length-1;
    
    } else { /* DO NOTHING */ } 

    this.getPageByUrl(param);

  }

  // navigate directly to a specific page
  public getOnePage(page:number) {
    this.currentPage = page;
    let url = `${this.todoService.base_url}/todos/page/?page=${page}&size=${this.SIZE_PAGE}`;
    this.getPageByUrl(url);
  }

  public getPageByUrl(url: string) {
    this.todoService.getTodosPaginationByUrl(url).pipe(takeUntil(this.destroy$)).subscribe(
      res => {
        this.todoCustom = res.body['content'] as TodoCustom[];
        this.numberPages = new Array<number>(res.body['totalPages'] as number);
        let rawLinks = res['headers'].get('link') as string;
        this.setLinksFromHeader(rawLinks);
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
  
  private setLinksFromHeader(rawLinks: string) {
    if (rawLinks.length > 0) {
      this.linksPagination = {};
      let parts = rawLinks.split(',');
      parts.forEach(p => {
        let section = p.split(';');
        let url = section[0].replace(/<(.*)>/, '$1').trim();
        let name = section[1].replace(/rel="(.*)"/, '$1').trim();
        this.linksPagination[name] = url;
      });
    }
  }

  private getAllTodosList() {
    this.todoService.getAllTodosCustom().pipe(takeUntil(this.destroy$)).subscribe(
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

  public showPaginationAndGetFirstPage() {
    if ( !this.isPagination ) {
      this.formUserId.controls['id'].setValue(null);
      this.getOnePage(this.FIRST_PAGE);
    } else {
      this.getAllTodosList();
    }
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
          this.errorMessage = "You can't delete TODO from other users";
        } else if (error["status"] == 403){ // It shouldn't happen unless the user modifies the dom
          this.errorMessage = "You can't delete TODO from other users";
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
          //this.links = {};
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
