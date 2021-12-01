import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  ngOnInit(): void {
  }
  constructor(private router: Router){
    if(localStorage.getItem('email') == null){
      this.router.navigate(['/signIn'])
    }
    console.log("Where i am ",this.router.url, window.location.href)
  }
  title = 'EmployeeDetails';
}
