import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Product } from "../shared/product-cart-item.model";

interface ItemGroup {
 title :string,
 productItems: Product[],
}

export class ProductGroupResolverService{} /*implements Resolve<ItemGroup> {
 resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<ItemGroup> |
 Promise<ItemGroup> | ItemGroup {
  
 }

 
}*/