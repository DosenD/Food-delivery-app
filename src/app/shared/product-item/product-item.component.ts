import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { CartItem, Product } from 'src/app/shared/product-cart-item.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from '../product-overview/product-overview.component';
import {
 MatSnackBar,
 MatSnackBarHorizontalPosition,
 MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';



@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
 @ViewChild('myForm') myForm!: NgForm;
  form!: FormGroup;
  quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  toppingList: any[] = ['majonez', 'pavlaka', 'kecap', 'bez namaza'];
  saladList: string[] = ['kupus', 'zelena salata', 'paradajz', 'bez salate'];
  cartItems: CartItem[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  
  
  item!: Product;
  
  
  constructor(
   private fb: FormBuilder,
   private cartService: CartService,
   private _snackBar: MatSnackBar,
   public dialogRef: MatDialogRef<ProductItemComponent>,
   @Inject(MAT_DIALOG_DATA) public data: Product
   ) {}


  ngOnInit() {

    this.form = this.fb.group({
      quantity: new FormControl(null, Validators.required),
      toppings: new FormControl(null, Validators.required),
      salads: new FormControl(null, Validators.required),
    });
    
  }
  

  get quantityControl() {
    return this.form.get('quantity');
  }
  get toppingsChoice() {
    return this.form.get('toppings');
  }
  get saladChoice() {
    return this.form.get('salads');
  }

  addToCart() {
    const item = new CartItem(
     this.data,
     this.quantityControl?.value,
     this.toppingsChoice?.value,
     this.saladChoice?.value,
    );
    this.cartService.addItems(item);
    
    this._snackBar.open( 'Dodali ste proizvod u korpu', undefined, {
     horizontalPosition: this.horizontalPosition,
     verticalPosition: this.verticalPosition,
     duration: 3000,
    });
    this.myForm.resetForm();
    this.dialogRef.close();
  }
} 

