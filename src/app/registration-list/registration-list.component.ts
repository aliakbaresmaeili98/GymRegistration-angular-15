import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../models/user.mode';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss'],
})
export class RegistrationListComponent implements OnInit {
  dataSource!: MatTableDataSource<User>;
  users!: User[];
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'bmiResult',
    'gender',
    'package',
    'enquirayDate',
    'action',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private confirm: NgConfirmService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.service.getRegisterUser().subscribe((res) => {
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewDetail(id:number){
    this.router.navigate(['/detail',id])

  }
  editRow(id: number) {
    this.router.navigate(['update', id]);
  }
  deleteRow(id: number) {
    this.confirm.showConfirm(
      'Are you sure want to delte?',
      () => {
        this.service.deleteRegisterd(id).subscribe((res) => {
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Deleted Successfuly',
            duration: 3000,
          });
          this.getUsers()
        });
      },
      () => {}
    );
  }
}
