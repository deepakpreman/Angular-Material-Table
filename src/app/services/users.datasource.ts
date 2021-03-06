import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {ApiService} from "./api.service";
import {BehaviorSubject} from "rxjs";
import {catchError, finalize} from "rxjs/operators";
import {of} from "rxjs";



export class UsersDataSource implements DataSource<User> {

    private usersSubject = new BehaviorSubject<User[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public totalUser = 12;

    constructor(private apiService: ApiService) {}

    loadUsers(id:number,
                filter:string,
                sortDirection:string,
                pageIndex:number,
                pageSize:number) {

        this.loadingSubject.next(true);

        this.apiService.getUsers(id, filter, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(users => this.usersSubject.next(users));

    }

    connect(collectionViewer: CollectionViewer): Observable<User[]> {
        console.log("Connecting data source");
        return this.usersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.usersSubject.complete();
        this.loadingSubject.complete();
    }

}

