import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {debounceTime, distinctUntilChanged, startWith, tap, delay} from 'rxjs/operators';
import {merge} from "rxjs";
import {fromEvent} from 'rxjs';
import {User} from "../model/user";
import {UsersDataSource} from "../services/users.datasource";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit,AfterViewInit {


  user:User;

  totalUser : Number;

  dataSource: UsersDataSource;

  displayedColumns= ["id", "avatar", "first_name", "last_name", "email"];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  constructor(private apiService: ApiService) { }

  ngOnInit() {

    this.dataSource = new UsersDataSource(this.apiService);

    this.dataSource.loadUsers(1, '', 'asc', 0, 3);

    this.totalUser =  this.dataSource.totalUser;

}

ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    fromEvent(this.input.nativeElement,'keyup')
        .pipe(
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this.paginator.pageIndex = 0;

                this.loadUsersPage();
            })
        )
        .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
    .pipe(
        tap(() => this.loadUsersPage())
    )
    .subscribe();

}


  loadUsersPage() {
    this.dataSource.loadUsers(
        0,
        this.input.nativeElement.value,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize);
}

}
