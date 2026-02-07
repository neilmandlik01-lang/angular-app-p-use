import { Component, DestroyRef, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { BirthdayStore } from '../../store/birthday/birthday.store';
import { altMessages, DiffcultyEnum, GameNumberEnum, GameStatusEnum, hangmanAnswer, LetterStatusEnum, maxWordleAttempts, messages, name, wordleAnswer } from './birthday.enum';
import * as bootstrap from 'bootstrap'
import { Game } from '../../store/birthday/birthday.model';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-birthday',
  standalone: true, 
  imports: [
    ReactiveFormsModule
  ],
  providers:[
    BirthdayStore
  ],
  templateUrl: './birthday.html',
  styleUrls: ['./birthday.scss']
})
export class Birthday {

  destroyRef = inject(DestroyRef)

  birthdayStore = inject(BirthdayStore);

  gameStatusEnum = GameStatusEnum  
  gameNumberEnum = GameNumberEnum
  letterStatusEnum = LetterStatusEnum
  difficultyEnum = DiffcultyEnum

  wordleModal = viewChild<ElementRef>('wordleModal');
  hangmanModal = viewChild<ElementRef>('hangmanModal');
  connectionsModal = viewChild<ElementRef>('connectionsModal');
  
  connectionsInput = viewChild<ElementRef>('connectionsInput')
  wordleInput = viewChild<ElementRef>('wordleInput');
  hangmanInput = viewChild<ElementRef>('hangmanInput')

  wordleAnswer = wordleAnswer
  hangmanAnswer = hangmanAnswer
  name = name
  messages = messages

  Array = Array
  connectionInputs = this.birthdayStore.connectionsForm().get('inputs') as FormArray

  wordleSolvedEffect = effect(()=>{
    if(this.birthdayStore.isWordleSolved()){
      queueMicrotask(()=>{
        this.birthdayStore.setCompletionStatus(this.gameNumberEnum.WORDLE)
      })
    }
  })

  hangmanSolvedEffect = effect(()=>{
    if(this.birthdayStore.isHangmanSolved()){
      queueMicrotask(()=>{
        this.birthdayStore.setCompletionStatus(this.gameNumberEnum.HANGMAN)
      })
    }
  })

  connectionsSolvedEffect = effect(() => {
    if(this.birthdayStore.isConnectionsSolved()){
      queueMicrotask(()=>{
        this.birthdayStore.setCompletionStatus(this.gameNumberEnum.CONNECTIONS)
      })
    }
  })

  openGameModal(game: Game){
    let gameModalEl = null;
    switch(game.number){
      case GameNumberEnum.WORDLE:
        if (this.birthdayStore.isWordleSolved()) return
        gameModalEl = this.wordleModal()?.nativeElement;
        this.birthdayStore.initializeWordleForm()
        break;
      case GameNumberEnum.HANGMAN:
        if(this.birthdayStore.isHangmanSolved()) return
        gameModalEl = this.hangmanModal()?.nativeElement;
        this.birthdayStore.initializeHangmanLetters()
        break;
      case GameNumberEnum.CONNECTIONS:
        if(this.birthdayStore.isConnectionsSolved()) return
        gameModalEl = this.connectionsModal()?.nativeElement;
        break;
      default:
        gameModalEl = this.wordleModal()?.nativeElement;
        break;
    }
    this.birthdayStore.setIsModalClosed(game.number,false)
    const modalEl = new bootstrap.Modal(gameModalEl,{
      focus: false,
      backdrop: 'static',
      keyboard: false
    });
    if(modalEl && game.status == GameStatusEnum.UNLOCKED){
      
      gameModalEl.addEventListener(
        'shown.bs.modal',
        () => {
          if(game.number == this.gameNumberEnum.WORDLE){
            this.wordleInput()?.nativeElement.focus();
          }
          else if(game.number == this.gameNumberEnum.HANGMAN){
            this.hangmanInput()?.nativeElement.focus()
          }
          else if(game.number == this.gameNumberEnum.CONNECTIONS){
            this.connectionsInput()?.nativeElement.focus()
          }
        },
        { once: true }
      );
      
      modalEl.show()
    }
  }

  onSubmitWordle(){
    const word = this.birthdayStore.wordleForm().controls['word'].value;
    if(word.length != 5) return;
    this.birthdayStore.addWordleGuess(word);  
    this.birthdayStore.initializeWordleForm();
    this.birthdayStore.setRowNumber(this.birthdayStore.rowNumber() + 1);  
    console.log(this.birthdayStore.isWordleSolved())
  }

  onSubmitHangman(){
    const character = this.birthdayStore.hangmanForm().controls['character']
    if(this.birthdayStore.hangmanGuesses().includes(character.value)) return
    if(character.value.length == 1){
      this.birthdayStore.changeHangmanLetter(character.value)
      this.birthdayStore.initializeHangmanForm()
    }
  }

  shuffleConnections(){
    this.birthdayStore.shuffleConnections()
    this.connectionsInput()?.nativeElement.focus() 
  }

  toggleSelection(index: number){
    this.birthdayStore.toggleConnectionCard(index)
  }

  onConnectionsSubmit(){
    this.birthdayStore.checkSelectedCards()   
  }

  resetConnections(){
    this.birthdayStore.resetConnections()
    this.connectionsInput()?.nativeElement.focus() 
  }

  onCloseModal(num: GameNumberEnum){
    if(num==this.gameNumberEnum.WORDLE){
      this.closeModal(this.wordleModal()?.nativeElement);
    }
    else if(num == this.gameNumberEnum.HANGMAN){
      this.closeModal(this.hangmanModal()?.nativeElement)
    }
    else if(num == this.gameNumberEnum.CONNECTIONS){
      this.closeModal(this.connectionsModal()?.nativeElement)
    }
    this.birthdayStore.setIsModalClosed(num,true)

  }

  closeModal(modal: HTMLElement){
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance?.hide();
  }

}
