import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
 
export class AppComponent implements OnInit {
  title:string=null;
  fileData: File = null;
  previewUrl:any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  ModelTable:boolean=false;
  TriggerModel:boolean=true;
  UploadTable:boolean=false;
  
  data:any={};
  uploadeddata:any={};

  


  constructor(private http: HttpClient) { }


  ngOnInit() {
  }
   
  fileProgress(fileInput: any) {
      this.fileData = <File>fileInput.target.files[0];
      this.preview();
  }
 
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => { 
      this.previewUrl = reader.result; 
    }
  }

  testModel(emp_id){

    const formData = new FormData();
      formData.append('myFile', this.fileData);
      formData.append('id', emp_id);
      // console.log("emp_id:"+emp_id)
      this.http.post('http://localhost:3000/uploadfile', formData)
        .subscribe(res => {
          console.log(res);
          this.data=res;
          if(this.data.ClaimFlag==1){
            this.data.ClaimFlag="Approved";
          }
          else{
            this.data.ClaimFlag="Pending"
          }
          this.ModelTable=true;
          // this.TriggerModel=false;
          // this.uploadeddata=res;
          // this.UploadTable=true;
          // alert('SUCCESS !!');
          // this.uploadedFilePath = res.data.Filepath;
        })

    // let body = `id=${emp_id}`;
    // const formData = new FormData();
    // formData.append('id', emp_id);
    //     this.http.post('http://localhost:3000/getbill', body)
    //     .subscribe(res => {
    //       console.log(res);
    //       // this.uploadedFilePath = res.data.Filepath;
    //       this.ModelTable=true;
    //       this.data=res;
    //     }) 
  }
   
  onSubmit(emp_id) {
      const formData = new FormData();
      formData.append('myFile', this.fileData);
      formData.append('id', emp_id);
      // console.log("emp_id:"+emp_id)
      this.http.post('http://localhost:3000/uploadfile', formData)
        .subscribe(res => {
          console.log(res);
          this.TriggerModel=false;
          this.uploadeddata=res;
          this.UploadTable=true;
          // alert('SUCCESS !!');
          // this.uploadedFilePath = res.data.Filepath;
        })

  }
}
