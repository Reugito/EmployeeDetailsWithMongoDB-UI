import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudOprationsService } from 'src/app/service/crud-oprations.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInForm!: FormGroup
  constructor(private formBuilder: FormBuilder,
    private empService: CrudOprationsService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('[A-Z]{1,}[a-z]{1,}[@$%&]{1}[0-9]{1,}')]],
      });
    }

  signIn(empDetails:any){
    this.empService.empLogIn(empDetails).subscribe(data =>{
      console.log(data)
      if(data.responseCode == '200'){
        localStorage.setItem('email', empDetails.email)
        localStorage.setItem('password', empDetails.password)
        this.router.navigate([''])
      }
      this.snackBar.open(data.response);
    })
   
  }

}
