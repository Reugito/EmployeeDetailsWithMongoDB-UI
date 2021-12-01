import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CrudOprationsService } from 'src/app/service/crud-oprations.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  empDetails: any
  pageNo = 1;
  totalEmpCount:any
  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  constructor(private empServices:CrudOprationsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe) { 
  }

  ngOnInit(): void {
    this.getAllEmployees()
    this.getAllEmployeeCount()
    this.checkAdminLoggedIn()
  }

  searchBy = new FormControl();
  paramList: string[] = ['id','firstName', 'lastName', 'phoneNo', 'startDate', 'endDate', 
                        'startDate,endDate', 'approved', 'rejected'];

  getAllEmployees(){
    this.empServices.getEmployeeDetails("","") .subscribe(data =>{
      if(data.responseCode == 200){
        this.empDetails = data.response
        this.pageNo = 1;
        this.getAllEmployeeCount()
        console.log(data.response)
      }else{
        this.snackBar.open(data.response)
      }
      
    })
  }

  approveStatus(id:number){
    this.empServices.approveEmployeeStatus(id).subscribe(data =>{
      if(data.responseCode ==200){
        this.snackBar.open(data.response)
        setTimeout(() => {
          this.getAllEmployees()
        }, 1000);
      }else{
        this.snackBar.open(data.response)
      }
    })
  }

  rejectStatus(id:number){
    this.empServices.rejectEmployeeStatus(id).subscribe(data =>{
      this.snackBar.open(data.response)
    })
    setTimeout(() => {
      this.getAllEmployees()
    }, 1000);
  }

  searchInput!: string
  error =""
  search(param:any, value:string,){
    this.empServices.getEmployeeDetails(param, value).subscribe(data =>{
      if(data.responseCode == 200){
        this.empDetails = data.response
        this.totalEmpCount = this.empDetails.length
      }else{
        this.snackBar.open(data.response)
        console.log('--------',data.response)
      }
    }, (error)=>{this.snackBar.open(error.error.response)})
  }

  inputValidator(value: string, param:any){
    this.error = ""
    if(param == 'id'){
      if(new RegExp('^([0-9]{1,})$').test(value)){
        this.search(param, value)
      }else{
        this.error = "Invalid empId"
      }
    }
    else if(param == 'firstName'){
      if(new RegExp('^[A-Z]{1}[a-z]{2,}$').test(value)){ 
        this.search(param, value)
      }else
        this.error = "Invalid firstName"
    }
    else if(param == 'lastName'){
      if(new RegExp('^[A-Z]{1}[a-z]{2,}$').test(value)){ 
        this.search(param, value)
      }else
        this.error = "Invalid lastName"
    }
    else if(param == 'phoneNo'){
      if(new RegExp('^[7-9]{1}[0-9]{9}$').test(value)){ 
        this.search(param, value)
      }else
        this.error = "Invalid phoneNo"
    }
  }

 param = ""
  getParam(param:any){
    this.param = param
    if(this.param == 'approved' || this.param == 'rejected'){
      this.getAllEmployeesByStatus(this.param)
    }
  }
 
  nextPage(){
    if(this.empDetails.length >=10 ){
      this.pageNo = this.pageNo+1
      console.log(" pane next",this.pageNo)
      this.empServices.getEmployeeDetails('pageNo', this.pageNo ).subscribe(data =>{this.empDetails = data.response});
    }
    
  }

  previousPage(){
    if(this.pageNo > 1){
      this.pageNo = this.pageNo-1
      console.log(" pane r",this.pageNo)
      this.empServices.getEmployeeDetails('pageNo', this.pageNo ).subscribe(data =>{this.empDetails = data.response});
    }
  }

  deleteEmployee(id: number){
    this.empServices.deleteEmployeeDetails(id).subscribe(data => {
      this.snackBar.open(data.response)
    })
    setTimeout(() => {
      this.getAllEmployees()
    }, 500);
    
  }  

  getAllEmployeesByStatus(status:string){
    this.empServices.getAllEmployeesByStatus(this.param).subscribe(data =>{
      if(data.responseCode == 200){
        this.empDetails = data.response
        this.totalEmpCount = this.empDetails.length
      }else{
        this.snackBar.open(data.response)
      }
    })
  }

  logOut(){
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    this.router.navigate(['/signIn']);
  }

  searchBetweenDates(start:any, end:any){
    if(start != end){
      this.empServices.searchBetweenDates(this.transformDate(start), this.transformDate(end) )
      .subscribe(data => {
        this.empDetails = data.response
        this.totalEmpCount = this.empDetails.length
      })
    }
  }

  transformDate(date: any) {
    var dateToDBthis = this.datePipe.transform(date, 'yyyy-MM-dd');
    return  dateToDBthis
  }

  getAllEmployeeCount(){
    this.empServices.getTotalEmployeeCount().subscribe(data =>{
      this.totalEmpCount = data.response
    })
  }

date:any
searchByStartAndEndDate(param:any,date:any){
  this.empServices.getEmployeeDetails(param,this.transformDate(date)).subscribe(data=>{
    if(data.responseCode == 200){
      this.empDetails = data.response
    }else{
      this.snackBar.open(data.response)
    }   
  })
}

isAdminLoggedIn = false
checkAdminLoggedIn(){
  if(localStorage.getItem('email') == "raosahebdhotre88@gmail.com"){
    this.isAdminLoggedIn = true
  }
}

}

