import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangePasswordDto } from 'src/app/Models/dto/ChangePasswordDto';
import { ClasseProfDto } from 'src/app/Models/dto/ClasseProfDto';
import { Eleve } from 'src/app/Models/eleve';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { classeGroupService } from 'src/app/Services/classe-group.service';


@Component({
  selector: 'app-dashboard-eleve-home',
  templateUrl: './dashboard-eleve-home.component.html',
  styleUrls: ['./dashboard-eleve-home.component.css']
})
export class DashboardEleveHomeComponent implements OnInit {
  listProfOfClasse!: ClasseProfDto[];
  classe_name!: string;
  eleveInfo!: Eleve;
  fromChangePass!: FormGroup;
  isFlowVisible = true;
  check :boolean = false;

  constructor(
    private service: classeGroupService,
    private serviceauth: AuthServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.service.getProfClasseGroup(1).subscribe(data => {
      this.listProfOfClasse = data;
      if (data.length > 0) {
        this.classe_name = data[0].class_name;
      }
    });

    this.serviceauth.getEleveById(3).subscribe(data => {
      this.eleveInfo = data;
      this.fromChangePass = this.fb.group({
        password: [
          this.eleveInfo.password, 
          [Validators.required, Validators.minLength(4)] 
        ]
      });
    });
  }

  toggleFlow(inputElement: HTMLInputElement): void {
    this.isFlowVisible = !this.isFlowVisible;
    if (!this.isFlowVisible) {
      inputElement.value = ''; 
    }
  }

  changePassword(): void {
    if (this.fromChangePass.valid) {
      const newEleve: ChangePasswordDto = {
        password: this.fromChangePass.get('password')?.value
      };
  
      this.serviceauth.changePassword(3, newEleve).subscribe();
      this.fromChangePass.reset();
      alert('Password changed successfully');
    }
  }
  
  
  
}
