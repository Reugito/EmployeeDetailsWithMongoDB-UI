import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { SigninComponent } from './component/signin/signin.component';
import { UpdateComponent } from './component/update/update.component';

const routes: Routes = [
  {path: "register", component: RegisterComponent},

  {path:'signIn', component: SigninComponent},
  {path: "", component: DashboardComponent},
  {path:'update/:id', component: UpdateComponent}

 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
