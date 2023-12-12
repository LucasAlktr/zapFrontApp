import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DocService } from '../services/doc.service';
import { CoreService } from '../core/core.service';
import { UserService } from '../services/user.service';  
import { CompanyService } from '../services/company.service'; 

@Component({
  selector: 'app-create-doc',
  templateUrl: './create-doc.component.html',
  styleUrls: ['./create-doc.component.scss'],
})
export class CreateDocComponent implements OnInit {
  createDocForm: FormGroup;
  users: any[] = [];
  companies: any[] = [];  

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateDocComponent>,
    private docService: DocService,
    private coreService: CoreService,
    private userService: UserService,
    private companyService: CompanyService
  ) {
    this.createDocForm = this.fb.group({
      name: ['', Validators.required],
      date_limit_to_sign: ['', Validators.required],
      signed: [false],
      created_by_user: [null, Validators.required],  
      company: [null, Validators.required],  
    });
  }

  ngOnInit(): void {
    this.userService.listUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error(error);
      }
    );

    this.companyService.listCompanies().subscribe(
      (data) => {
        this.companies = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onFormSubmit() {
    if (this.createDocForm.valid) {
      const formData = this.createDocForm.value;

      this.docService.createDoc(formData).subscribe(
        (res) => {
          this.coreService.openSnackBar('Document created successfully!');
          this.dialogRef.close(true);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  onCancelClick() {
    this.dialogRef.close(false);
  }
  get nameControl() {
    return this.createDocForm.get('name');
  }

  get dateLimitControl() {
    return this.createDocForm.get('date_limit_to_sign');
  }
}
