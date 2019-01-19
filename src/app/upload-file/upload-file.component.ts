import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  task: AngularFireUploadTask;

  percentage: Observable<number>;

  snapshot: Observable<any>;

  downloadURL: Observable<string>;

  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {
  }

  startUpload(event: FileList) {
    const file = event[0];

    const path = `myImages/${new Date().getTime()}_${file.name}`;

    const fileRef = this.storage.ref(path);

    this.task = this.storage.upload(path, file);

    this.percentage = this.task.percentageChanges().pipe(
      map(data => {
        console.log(data);
        return data;
      })
    );

    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
      })
    ).subscribe();


  }
}
