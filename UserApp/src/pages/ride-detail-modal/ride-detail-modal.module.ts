import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RideDetailModalPage } from './ride-detail-modal';

@NgModule({
  declarations: [
    RideDetailModalPage,
  ],
  imports: [
    IonicPageModule.forChild(RideDetailModalPage),
  ],
})
export class RideDetailModalPageModule {}
