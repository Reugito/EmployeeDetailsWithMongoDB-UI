import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CrudOprationsService } from 'src/app/service/crud-oprations.service';
import { MustMatch } from './MustMatch';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
 
  registerForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
          private router:Router, private empService: CrudOprationsService,
          private route: ActivatedRoute,
          private snackBar: MatSnackBar) {
           }

  ngOnInit(): void {
    this.regForm()
  }


  regForm(){
    this.registerForm = this.formBuilder.group({
      empId:['', [Validators.required, Validators.pattern('[0-9]{1,8}')]],
      image:['', Validators.required],
      firstName: ['', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{2,}')]],
      lastName: ['', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{2,}')]],
      phoneNo:['', [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
      startDate:['', Validators.required],
      endDate:[''],
      address:['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('[A-Z]{1,}[a-z]{1,}[@$%&]{1}[0-9]{1,}')]],
      confirmPassword:['', Validators.required]
    },
     {
      validator: MustMatch('password', 'confirmPassword')});
  }

  onSubmit(regDetails:any){ 
    regDetails.startDate= this.transformDate(regDetails.startDate)
    regDetails.endDate = this.transformDate(this.getEndDate(regDetails.startDate))
    regDetails.image = this.files
    const form = new FormData()
    for(var i in regDetails){
      form.append(i, regDetails[i])
    }

    this.empService.registerEmployee(form).subscribe(data =>{
      if(data.responseCode == '200' && localStorage.getItem('email') != "raosahebdhotre88@gmail.com"){
        this.router.navigate(['/signIn'])
      }else  if(data.responseCode == '200' && localStorage.getItem('email') == "raosahebdhotre88@gmail.com"){
        this.router.navigate(['/'])
      }
      this.snackBar.open(data.response)
    }, (error) =>{this.snackBar.open(error.error.response)})
    
  }

  transformDate(date: Date) {
    var dateToDBthis = this.datePipe.transform(date, 'yyyy-MM-dd');
    return  dateToDBthis
  }

  getEndDate(startDate: Date){
    var date = new Date(startDate);
    date.setFullYear(date.getFullYear() + 1)
    return date
  }

  imgURL: any;
  files: any;
  isImageValid = true
  displayImage(file: any){
    if(file[0].size <= 3000000){
      this.files = file[0]
      var reader = new FileReader();
      reader.readAsDataURL(file[0]); 
      reader.onload = (_event) => { this.imgURL = reader.result; }
      this.isImageValid = false;
    }else if(file[0].size > 3000000){
      this.imgURL = ""
      this.isImageValid = true
      this.snackBar.open("Image size should be less than 3MB")
    }
  }

}
