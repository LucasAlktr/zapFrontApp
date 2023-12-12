import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateDocComponent } from './create-doc/create-doc.component';
import { DocService } from './services/doc.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { ConfirmationDialogComponent } from './events/ConfirmationDialogComponent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'created_at',
    'date_limit_to_sign',
    'signed',
    'created_by_user',
    'company',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _docService: DocService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getDocList();
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(CreateDocComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getDocList();
        }
      },
    });
  }

  getDocList() {
    this._docService.listDocs().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  signedDoc(id: number) {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmação',
        message: 'Tem certeza que deseja assinar este Documento?',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._docService.getDocDetail(id).subscribe({
          next: (doc) => {
            if (!doc.signed) {
              doc.signed = true;
              this._docService.updateDoc(id, doc).subscribe({
                next: () => {
                  this._coreService.openSnackBar('Document signed!', 'done');
                  this.getDocList();
                },
                error: console.log,
              });
            } else {
              this._coreService.openSnackBar('Document already signed!', 'warn');
            }
          },
          error: console.log,
        });
      }
    });
  }

  deleteDoc(id: number) {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmação',
        message: 'Tem certeza que deseja excluir este Documento?',
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._docService.deleteDoc(id).subscribe({
          next: (res) => {
            this._coreService.openSnackBar('Document deleted!', 'done');
            this.getDocList();
          },
          error: console.log,
        });
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(CreateDocComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getDocList();
        }
      },
    });
  }
}
