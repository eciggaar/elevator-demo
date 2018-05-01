/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

 /**
 * An elevator changes state
 * @param {composer.elevator.Maintenance} maintenance - elevator maintenance trigger
 * @transaction
 */

 async function elevatorMaintenance(maintenance) {
   //Updating the maintenance sheet of the elevator
   let sheet = maintenance.assetID.sheet;
   let factory = getFactory();
   const ts = new Date(maintenance.maintenanceTimestamp);
   sheet.elevatorID = maintenance.assetID.elevatorID;

   if (maintenance.indicator) {
     //Start maintenance -> save start time and increase #maintenance events
     sheet.reason = maintenance.reason;
     sheet.startTime = ts;
     sheet.stopTime = null;
     sheet.timeInMaintenance = null;
   } else {
     //Stop maintenance -> save stop time to calculate
     sheet.stopTime = ts;
     sheet.timeInMaintenance = parseFloat((((sheet.stopTime - sheet.startTime) / 1000)).toFixed(0));
   }

   //Save the maintenance sheet
   const sheetRegistry = await getAssetRegistry('composer.elevator.MaintenanceSheet');
   await sheetRegistry.update(sheet);

   // emit the event
   const maintenanceEvent = factory.newEvent('composer.elevator', 'MaintenanceEvent');
   maintenanceEvent.sheet = sheet;
   emit(maintenanceEvent); 
}
