import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserComponent } from './components/user/user.component';
import { UserService } from './services/user.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  displayedColumns: string[] = ['id', 'title', 'description', 'number', 'currency', 'date', 'autocomplete','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    ) {}

  ngOnInit(): void {
    this.getAllUserList();
  }

  // add user btn
  addUserBtn() {
    const dialog = this.dialog.open(UserComponent);
    dialog.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllUserList(); // for the refesh after adding new user
        }
      }
    })
  }

  getAllUserList(){
      this.userService.getAllUserList().subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;

        },
        error: (err: any) => {
          console.error(err);
        }
      })
  }

  // filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  //   // delete btn
  // deleteUserbtn(id: number){
  //   this.userService.deleteUser(id).subscribe({
  //     next: (res) => {
  //       alert ('Deleted SuccessFully');
  //       this.getAllUserList(); //refresh
  //     },
  //     error: console.log,

  //   })
  // }
  deleteUserbtn(id: number){
    const confirmation = confirm('Are you sure you want to delete this item ?');
    if (confirmation) {
      this.userService.deleteUser(id).subscribe({
        next: (res) => {
          this.getAllUserList(); //refresh
        },
        error: console.log,
      });
    }
  }


  // cancel button
  editUserBtn(data: any) {
    const dialog = this.dialog.open(UserComponent, {
      data,
    })

    dialog.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getAllUserList(); // for update
        }
      }
    })

  }


}
