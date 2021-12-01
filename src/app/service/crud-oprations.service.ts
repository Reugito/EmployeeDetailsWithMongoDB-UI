import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CrudOprationsService {
  url = 'http://localhost:8080/emp/'
  constructor(private http: HttpClient) { }

  getEmployeeDetails(key:any, value:any): Observable<any>{
    let DTO: any
    if(value == "" && key ==""){
      DTO = {[key]:value, 'pageNo':'1', 'pageSize':'10'}
    }else{
      DTO = {[key]:value, 'pageSize':10}
    }
      const params = new HttpParams()
      .set('searchDTO', JSON.stringify(DTO))
      return this.http.get(this.url+'getall',{params: params})
  }

  registerEmployee(details:any): Observable<any>{
    return this.http.post(this.url+'add', details)
  }

  approveEmployeeStatus(id : number): Observable<any>{
    return this.http.put(this.url+`approve/${id}`, null)
  }

  rejectEmployeeStatus(id : number): Observable<any>{
    return this.http.put(this.url+`reject/${id}`, null)
  }

  updateEmployeeDetails(empDetails:any): Observable<any>{
    return this.http.put(this.url+`update`, empDetails)
  }

  deleteEmployeeDetails(id: number):Observable<any>{
    return this.http.delete(this.url+`delete/${id}`)
  }

  empLogIn(empDetails:any):Observable<any>{
    const params = new HttpParams()
            .set('email', empDetails.email)
            .set('password', empDetails.password)
    return this.http.post(this.url+`login`,params)
  }

  getAllEmployeesByStatus(status: string):Observable<any>{
    const params = new HttpParams().set('status', status)
    return this.http.get(this.url+`getall/status`,{params:params})
  }

  searchBetweenDates(startDate:any, endDate: any): Observable<any>{
    let DTO = {'startDate':startDate, 'endDate':endDate}
    const params = new HttpParams()
    .set('searchDTO', JSON.stringify(DTO))
    return this.http.get(this.url+'getall',{params: params})

  }

  getTotalEmployeeCount(): Observable<any>{
    return this.http.get(this.url+`empcount`)
  }

  uploadImage(formData: any){
    console.log(" formdata ", formData)
    return this.http.post(this.url+`upload`,formData)
  }

}
