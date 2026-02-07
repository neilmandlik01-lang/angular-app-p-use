import { AfterViewInit, Component, ElementRef, signal, viewChild, viewChildren } from '@angular/core';

@Component({
  selector: 'app-valentine',
  imports: [],
  templateUrl: './valentine.html',
  styleUrl: './valentine.scss',
})
export class Valentine implements AfterViewInit{

  sheSayYes = signal<boolean>(false)
  changeButton = viewChildren<ElementRef>('changeButton')
  btnEl1!: HTMLButtonElement; 
  btnEl2!: HTMLButtonElement;
  
  ngAfterViewInit(): void {
    this.btnEl1 = this.changeButton()[0].nativeElement
    this.btnEl2 = this.changeButton()[1].nativeElement
  }

  swap1ToYes() {
    this.btnEl1.innerText = "Yes"
    this.btnEl2.innerText = "No"

  }

  swap2ToYes(){
    this.btnEl1.innerText = "No"
    this.btnEl2.innerText = "Yes"
  }

  saidYes(){
    this.sheSayYes.set(true)
  }

}
