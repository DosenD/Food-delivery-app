import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem, OrderItem } from 'src/app/shared/all-models';
import { BrowserStorageService } from '../../services/browser-storage.service';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/database';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss'],
})
export class CheckOutComponent implements OnInit, OnDestroy {
  constructor(
    private cartService: CartService,
    private browserStorageService: BrowserStorageService,
    private fb: FormBuilder,
    private db: AngularFireDatabase
  ) {}

  private cartItemsSub!: Subscription;
  @ViewChild('myForm') myForm!: NgForm;
  cartItem!: CartItem;
  cartItems!: CartItem[];
  form!: FormGroup;
  sum = 0;
  nowArray: number[] = [];
  cartEmpty = false;
  storeClosed = false;
  orderSent = false;

  ngOnInit(): void {
    this.cartItemsSub = this.cartService.items.subscribe((result) => {
      this.cartItems = result;
      this.cartItems.forEach((a) => (this.sum += a.product.price * a.quantity));
      return this.cartItems;
    });

    this.form = this.fb.group({
      firstName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]{3,20}$/),
      ]),
      lastName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]{3,20}$/),
      ]),
      streetName: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]{3,40}$/),
      ]),
      houseOrBuildingNum: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{1,4}$/),
      ]),
      apartmentNum: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{1,4}$/),
      ]),
      phoneNum: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{6,14}$/),
      ]),
    });
  }

  ngOnDestroy(): void {
    this.cartItemsSub.unsubscribe();
  }
  // input value getters

  get firstName() {
    return this.form.get('firstName');
  }
  get lastName() {
    return this.form.get('lastName');
  }
  get fullName() {
    return this.firstName?.value.concat(' ', this.lastName?.value);
  }
  get streetName() {
    return this.form.get('streetName');
  }
  get houseOrBuildingNum() {
    return this.form.get('houseOrBuildingNum');
  }
  get apartmentNum() {
    return this.form.get('apartmentNum');
  }
  get phoneNumber() {
    return this.form.get('phoneNum');
  }

  addOrder(): void {
    const now = new Date();
    const workHours = +now.getHours();
    const order: OrderItem = {
      items: this.cartItems,
      fullName: this.fullName,
      streetName: this.streetName?.value,
      houseOrBuildNum: this.houseOrBuildingNum?.value,
      apartmentNum: this.apartmentNum?.value,
      phoneNum: this.phoneNumber?.value,
      createdAt: formatDate(now, 'HH:mm:ss dd/MM/yyyy', 'en-us'), //formatiramo date object i prebacujemo ga u string
    } as OrderItem;

    if (!this.cartItems.length) {
      this.cartEmpty = true;
      this.myForm.resetForm();
      this.cartService.resetItems();
      this.browserStorageService.removeSession();
    } else {
      this.db.list('orders').push(order);
      this.myForm.resetForm();
      this.cartService.resetItems();
      this.browserStorageService.removeSession();
      this.orderSent = true;
    }
  }
  closeMessage() {
    this.cartEmpty = false;
    this.storeClosed = false;
    this.orderSent = false;
  }
}
