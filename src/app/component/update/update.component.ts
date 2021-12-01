import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudOprationsService } from 'src/app/service/crud-oprations.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  registerForm!: FormGroup;
  empDetails!: any
  imageURL:any
  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe,
    private router:Router, private empService: CrudOprationsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.regForm()
    this.setDetailsForUpdate(this.route.snapshot.paramMap.get("id"))
    
  }

  setDetailsForUpdate(id:any){
    this.empService.getEmployeeDetails("id", id).subscribe(data =>{
      this.empDetails = data.response[0]
      this.updateForm(this.empDetails)
    })
  }

  updateForm(empDetails: any){
    console.log("employee details ",empDetails)
    this.imageURL=empDetails.image.data
    this.registerForm.setValue({
      empId: empDetails.id,
      firstName: empDetails.firstName,
      lastName: empDetails.lastName,
      phoneNo:empDetails.phoneNo,
      startDate: empDetails.startDate,
      endDate: empDetails.endDate,
      address: empDetails.address,
      emailId: empDetails.email,
      password: empDetails.password
    })
  
  }

  regForm(){
    this.registerForm = this.formBuilder.group({
      empId:['', [Validators.required, Validators.pattern('[0-9]{1,8}')]],
      firstName: ['', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{2,}')]],
      lastName: ['', [Validators.required, Validators.pattern('[A-Z]{1}[a-z]{2,}')]],
      phoneNo:['', [Validators.required, Validators.pattern('[7-9]{1}[0-9]{9}')]],
      startDate:['', Validators.required],
      endDate:['',Validators.required],
      address:['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(regDetails:any){ 
    console.log("update ", regDetails)
    regDetails.startDate= this.transformDate(regDetails.startDate)
    regDetails.endDate = this.transformDate(regDetails.endDate)
   this.empService.updateEmployeeDetails(regDetails).subscribe(data => {
     if(data.responseCode == '200'){
       this.snackBar.open(data.response)
      this.router.navigate([''])
     }else{
      this.snackBar.open(data.response)
     }
   }, (error) =>{
    this.snackBar.open(error.error.response)
  })
  }

  transformDate(date: any) {
    var dateToDBthis = this.datePipe.transform(date, 'yyyy-MM-dd');
    return  dateToDBthis
  }

  imgURL: any

  displayImage(file: any){  
    if(file[0].size <= 3000000){
      var reader = new FileReader();
      reader.readAsDataURL(file[0]); 
      reader.onload = (_event) => {
        this.imageURL = null
         this.imgURL = reader.result; 
         this.updateImage(file[0])
        }
    }else if(file[0].size > 3000000){
      this.snackBar.open("Image size should be less than 3MB")
    }
   

  }

  updateImage(image: any){
    const formData = new FormData();
    formData.append('image', image)
    formData.append('empID', this.empDetails.id)
    this.empService.uploadImage(formData).subscribe()
  }
 
}
