import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.mode';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  public userID!: number;
  public userDetail!: User;

  constructor(
    private service: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((val) => {
      this.userID = val['id'];
      this.fetchUserDetails(this.userID)
    });
  }

  fetchUserDetails(userID: number) {
    this.service.getRegisterUserId(userID).subscribe((res) => {
      this.userDetail = res;
      console.log(this.userDetail);
      
    });
  }
}
