import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Inject } from '@angular/core';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  userForm : FormGroup;

  numbers: string[] = [
    "one",
    "two",
    "three"
  ]

  // autocompleteOptions: string[] = [
  //   'Option A',
  //   'Option B',
  //   'Option C'
  // ];

  //autocomplete
  autocomplete = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;


  constructor(
    private formbuild: FormBuilder,
    private userService: UserService,
    private dialogref: MatDialogRef<UserComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any   // for the edit
    ){

    this.userForm = this.formbuild.group({
      title: ['', Validators.required],
      number: ['', Validators.required],
      description: ['', Validators.required],
      currency: ['', Validators.required],
      date: ['', Validators.compose([Validators.required, this.validateDate])],
      autocomplete: ''

    })

    // this.userForm = this.formbuild.group({
    //   title: '',
    //   number: '',
    //   description: '',
    //   currency: '',
    //   date: '',
    //   autocomplete: ''

    // })



  }
  ngOnInit(): void {
    this.userForm.patchValue(this.data);  //edit

    // autocomplted
    this.filteredOptions = this.autocomplete.valueChanges.pipe(

      startWith(''),
      map(value => this._filter(value || '')),
    );

  }


  //autocompleted
  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }



  onSubmit() {
    if (this.userForm.valid){
      if (this.data){
        this.userService.updateUser(this.data.id, this.userForm.value).subscribe({
          next: (value: any) => {
            // alert("Updated Successfully")
            this.dialogref.close(true); // for the refesh after adding new user

          },
          error: (err: any) => {
            console.error(err);
          }
        })

      }else{
        this.userService.addUser(this.userForm.value).subscribe({
          next: (value: any) => {
            alert("User Added Successfully")
            this.dialogref.close(true); // for the refesh after adding new user

          },
          error: (err: any) => {
            console.error(err);
          }
        })
      }

    }
  }

  // date validate
  validateDate(control: FormControl) {
    const selectedDate = control.value;
    const today = new Date();
    const selectedDateTime = new Date(selectedDate).getTime();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const difference = selectedDateTime - todayTime;
    if (difference < 0) {
      return { validateDate: true };
    }
    return null;
  }


  // isValidDate(control: FormControl): {[key: string]: any} | null {
  //   const dateRegEx = /^(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}$/; // MM/DD/YYYY format
  //   const valid = dateRegEx.test(control.value);
  //   return valid ? null : {invalidDate: true};
  // }

}
