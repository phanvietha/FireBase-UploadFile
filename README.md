# Upload File To Firebase With Drag and Drop

This tutorial will walk you through how to upload file from Angular to Firebase


# Step 1: Config for Firebase in Angular

  - Go to [firebase project](https://console.firebase.google.com/u/0/), and get config json in web seup
```sh
 {
      apiKey: 'AIzaSyB-ikVWsPeouCVYZEKwpMiBxg1qv5jluv8',
      authDomain: 'so-upload.firebaseapp.com',
      databaseURL: 'https://so-upload.firebaseio.com',
      projectId: 'so-upload',
      storageBucket: 'so-upload.appspot.com',
      messagingSenderId: '367478593763'
  }
};
```
   - Place `json config` into `environment.ts,``environment.ts live inside `enviroment folder`
```sh
export const environment = {
  production: false,
  firebase: {
      apiKey: 'AIzaSyB-ikVWsPeouCVYZEKwpMiBxg1qv5jluv8',
      authDomain: 'so-upload.firebaseapp.com',
      databaseURL: 'https://so-upload.firebaseio.com',
      projectId: 'so-upload',
      storageBucket: 'so-upload.appspot.com',
      messagingSenderId: '367478593763'
  }
};
```
   - Go into `app.module.ts` file and import needed Module
```sh
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireStorageModule
    ]
})
```

# Step 2: Create a dropdown directive for drag and drop file
 - The `event.preventDefault`, will stop the browser default behavior, `to not open file when user drop file in browser`
 - We also have to specify event.preventDefault for `dragover`, `dragleave` event. To prevent default behavior of browser
 - Listen to the `drop` event to get the list of file, that user drag in
 - Then transform event to FileList object and emit 
 
```sh
import { Directive, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
    selector: '[appDropDown]'
})
export class DropDownDirective {
    @Output() dropped = new EventEmitter<FileList>();

    @HostListener('drop', ['$event'])
    onDrop(event) {
        event.preventDefault(); // prevent open new tab
        this.dropped.emit(event.dataTransfer.files);
    }

    @HostListener('dragover', ['$event'])
    ononDragOver(event) {
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event'])
    ononDragLeave() {
        event.preventDefault();
    }
}
```
 - Last `declare` Dropdown Directive in `app.module.ts`
```
import { DropDownDirective } from './dropdown.directive';

@NgModule({
  declarations: [
    DropDownDirective
  ]
})
```
# Step 3: Using Dropdown Directive
 - Add appDropDown Directive into DropZone
 - Listen to the `dropped event emitter`
 - `$event` will hold the FileList object
```sh
<div class="dropzone" appDropDown (dropped)="startUpload($event)">
</div>
```
 - Import necessary function and interface
```
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
```
 - `task` Get access to `Observable data` and allow `cancel pause resume` uploading
 - `percentage` store percentage of uploading progress
 - `downloadURL` store the file url for user to download later
```
  task: AngularFireUploadTask;
  
  percentage: Observable<number>;

  snapshot: Observable<any>;

  downloadURL: Observable<string>;
```
### Injecting `AngularFireStorage` object
```
  constructor(private storage: AngularFireStorage) { }
```
### Create an `startUpload` functionto to handle file uploading
 - Get the first file in FileList
 - Create path for file
 - Reference to file path
 - Uploading file with `this.storage.upload(path, file)`
 - Subscribe to the `percentageChanges()` Observable for percentage progress
 - `finalize` operator call a function when `uploading complete`
 - Then you can get the downLoadURL by calling `getDownloadURL()` on the `fileRef` Object
 ```
  startUpload(event: FileList) {
    const file = event[0];
    
    const path = `myImages/${new Date().getTime()}_${file.name}`;

    const fileRef = this.storage.ref(path);

    this.task = this.storage.upload(path, file);

    this.percentage = this.task.percentageChanges().pipe(
      map(data => {
        console.log(data); // show percentage
        return data;
      })
    );

    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
      })
    ).subscribe();


  }
```



License
----
Phan Viet Ha
