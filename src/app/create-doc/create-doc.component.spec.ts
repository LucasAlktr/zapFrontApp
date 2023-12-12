import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateDocComponent } from './create-doc.component';
import { DocService } from '../services/doc.service';
import { CoreService } from '../core/core.service';
import { UserService } from '../services/user.service';
import { CompanyService } from '../services/company.service';
import { of } from 'rxjs';

describe('CreateDocComponent', () => {
  let component: CreateDocComponent;
  let fixture: ComponentFixture<CreateDocComponent>;
  let docServiceSpy: jasmine.SpyObj<DocService>;
  let coreServiceSpy: jasmine.SpyObj<CoreService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let companyServiceSpy: jasmine.SpyObj<CompanyService>;

  beforeEach(() => {
    docServiceSpy = jasmine.createSpyObj('DocService', ['createDoc']);
    coreServiceSpy = jasmine.createSpyObj('CoreService', ['openSnackBar']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['listUsers']);
    companyServiceSpy = jasmine.createSpyObj('CompanyService', ['listCompanies']);

    TestBed.configureTestingModule({
      declarations: [CreateDocComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: DocService, useValue: docServiceSpy },
        { provide: CoreService, useValue: coreServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: CompanyService, useValue: companyServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(CreateDocComponent);
    component = fixture.componentInstance;
  });

  it('deve-se criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve-se buscar usuários e empresas na inicialização do componente', fakeAsync(() => {
    const users = [{ id: 1, email: 'user1@example.com' }];
    const companies = [{ id: 1, name: 'Company A' }];

    userServiceSpy.listUsers.and.returnValue(of(users));
    companyServiceSpy.listCompanies.and.returnValue(of(companies));

    fixture.detectChanges();
    tick();

    expect(component.users).toEqual(users);
    expect(component.companies).toEqual(companies);
  }));

  it('deve-se chamar docService.createDoc() no envio do formulário', fakeAsync(() => {
    const formData = {
      name: 'Teste Documento',
      date_limit_to_sign: '2023-12-31',
      created_by_user: 1,
      company: 1,
    };

    component.createDocForm.setValue(formData);
    docServiceSpy.createDoc.and.returnValue(of({}));
    spyOn(component.dialogRef, 'close');

    component.onFormSubmit();
    tick();

    expect(docServiceSpy.createDoc).toHaveBeenCalledWith(formData);
    expect(coreServiceSpy.openSnackBar).toHaveBeenCalledWith('Documento criado com sucesso!');
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  }));

  it('deve-se fechar a caixa de diálogo ao clicar no botão cancelar', () => {
    spyOn(component.dialogRef, 'close');

    component.onCancelClick();

    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should display error message if form is invalid on submit', fakeAsync(() => {
    spyOn(coreServiceSpy, 'openSnackBar');
    spyOn(component.dialogRef, 'close');
  
    component.onFormSubmit();
    tick();
  
    expect(coreServiceSpy.openSnackBar).not.toHaveBeenCalled();
    expect(component.dialogRef.close).not.toHaveBeenCalled();
    expect(component.createDocForm.valid).toBeFalsy();
  
    const nameError = fixture.debugElement.nativeElement.querySelector('mat-error[formControlName="name"]');
    const dateLimitError = fixture.debugElement.nativeElement.querySelector('mat-error[formControlName="date_limit_to_sign"]');
    const createdByUserError = fixture.debugElement.nativeElement.querySelector('mat-error[formControlName="created_by_user"]');
    const companyError = fixture.debugElement.nativeElement.querySelector('mat-error[formControlName="company"]');
  
    expect(nameError.textContent).toContain('Nome é obrigatório!');
    expect(dateLimitError.textContent).toContain('Data Limite é Obrigatória!');
    expect(createdByUserError.textContent).toContain('Usuário Obrigatório!');
    expect(companyError.textContent).toContain('Companhia é Obrigatória!');
  }));
});
