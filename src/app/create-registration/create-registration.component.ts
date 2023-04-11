import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from '../models/user.mode';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss'],
})
export class CreateRegistrationComponent implements OnInit {
  public packages = ['Monthly', 'Quarterly', 'Yearly'];
  public genders = ['Male', 'Female'];
  public importantList: string[] = [
    'Toxic Fat reduction',
    'Energy and Endurance',
    'Building Lean Muscle',
    'Healtheir Digestive System',
    'Sugar Craving Body',
    'Fitness',
  ];

  public registerForm!: FormGroup;
  public userIdToUpdate!: number;
  public isUpdateActive: boolean = false;

  public get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private service: ApiService,
    private toastSerive: NgToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.registerForm.controls['height'].valueChanges.subscribe((res) => {
      this.calculateBmi(res);
    });
    this.activatedRoute.params.subscribe((val) => {
      this.userIdToUpdate = val['id'];
      this.service.getRegisterUserId(this.userIdToUpdate).subscribe((res) => {
        this.isUpdateActive = true;
        this.fillFormToUpdate(res);
      });
    });
  }

  initForm() {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquireDate: [''],
    });
  }

  submit() {
    this.service.postRegistration(this.registerForm.value).subscribe((res) => {
      this.toastSerive.success({
        detail: 'Success',
        summary: 'Enquiry Added',
        duration: 3000,
      });
      this.registerForm.reset();
    });
  }
  update() {
    this.service
      .updateRegisterUser(this.registerForm.value, this.userIdToUpdate)
      .subscribe((res) => {
        this.toastSerive.success({
          detail: 'Success',
          summary: 'Enquiry Updated',
          duration: 3000,
        });
        this.registerForm.reset();
        this.router.navigate(['list']);
      });
  }

  calculateBmi(heightValue: number) {
    const weight: number = Number(this.f['weight'].value);
    const height: number = Number(heightValue);
    const bmi: number = weight / (height * height);

    this.registerForm.controls['bmiResult'].setValue(this.setBmiResult(bmi));
    this.registerForm.controls['bmi'].patchValue(bmi);
  }

  setBmiResult(bmiIndex: number): string {
    let result: string = '';
    switch (true) {
      case bmiIndex <= 18.5:
        result = 'Underweight';
        break;
      case bmiIndex >= 18.5 && bmiIndex < 25:
        result = 'Normal';
        break;
      case bmiIndex >= 25 && bmiIndex < 30:
        result = 'overWeight';
        break;
      default:
        result = 'Obese';
        break;
    }

    return result;
  }

  fillFormToUpdate(user: User) {
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquireDate: user.enquireDate,
      id: user?.id,
    });
  }
}
