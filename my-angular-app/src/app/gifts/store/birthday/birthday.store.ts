import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { DiffcultyEnum, GameNumberEnum, GameStatusEnum, hangmanAnswer, LetterStatusEnum, maxHangmanAttempts, maxLivesLeft, maxSelectedCards, maxWordleAttempts, wordleAnswer } from "../../components/birthday/birthday.enum";
import { BirthdayInterface, CompletedCardsInterface, ConnectionInterface, LetterInterface } from "./birthday.model";
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from "@angular/forms";
import { computed, inject } from "@angular/core";
import { BirthdayHelpers } from "./birthday.helper";


const initialState: BirthdayInterface = {
    games: [
        {
            number: GameNumberEnum.WORDLE,
            status: GameStatusEnum.UNLOCKED,
            title: 'Wordle'
        },
        {
            number: GameNumberEnum.HANGMAN,
            status: GameStatusEnum.LOCKED,
            title: 'Hangman'
        },
        {
            number: GameNumberEnum.CONNECTIONS,
            status: GameStatusEnum.LOCKED,
            title: 'Maze'
        }
    ],

    rowNumber: 1,
    wordleForm: new FormGroup({}),
    hangmanForm: new FormGroup({}),
    connectionsForm: new FormGroup({}),

    wordleGuesses: [],
    hangmanGuesses: [],

    isWordleSolved: false,

    hangmanAnswerShow: [],
    hangmanStep: 1,

    connections: [
        {
            id: 1,
            groupId: 1,
            difficulty: DiffcultyEnum.EASY,
            text: 'I',
            isSelected: false
        },
        {
            id: 2,
            groupId: 1,
            difficulty: DiffcultyEnum.EASY,
            text: 'LOVE',
            isSelected: false
        },
        {
            id: 3,
            groupId: 1,
            difficulty: DiffcultyEnum.EASY,
            text: 'YOU',
            isSelected: false
        },
        {
            id: 4,
            groupId: 1,
            difficulty: DiffcultyEnum.EASY,
            text: 'MORE',
            isSelected: false
        },
        {
            id: 5,
            groupId: 2,
            difficulty: DiffcultyEnum.LOW,
            text: 'YANA',
            isSelected: false
        },
        {
            id: 6,
            groupId: 2,
            difficulty: DiffcultyEnum.LOW,
            text: 'BAROMETER',
            isSelected: false
        },
        {
            id: 7,
            groupId: 2,
            difficulty: DiffcultyEnum.LOW,
            text: 'TSUKI',
            isSelected: false
        },
        {
            id: 8,
            groupId: 2,
            difficulty: DiffcultyEnum.LOW,
            text: 'KOJI',
            isSelected: false
        },
        {
            id: 13,
            groupId: 4,
            difficulty: DiffcultyEnum.HIGH,
            text: 'BUBBLES',
            isSelected: false
        },
        {
            id: 14,
            groupId: 4,
            difficulty: DiffcultyEnum.HIGH,
            text: 'COOK',
            isSelected: false
        },
        {
            id: 15,
            groupId: 4,
            difficulty: DiffcultyEnum.HIGH,
            text: 'FLOOR TENNIS',
            isSelected: false
        },
        {
            id: 16,
            groupId: 4,
            difficulty: DiffcultyEnum.HIGH,
            text: 'CARDS',
            isSelected: false
        },
        
        {
            id: 9,
            groupId: 3,
            difficulty: DiffcultyEnum.MEDIUM,
            text: 'INDU',
            isSelected: false
        },
        {
            id: 10,
            groupId: 3,
            difficulty: DiffcultyEnum.MEDIUM,
            text: 'MY ROOM',
            isSelected: false
        },
        {
            id: 11,
            groupId: 3,
            difficulty: DiffcultyEnum.MEDIUM,
            text: 'MADHU SUDAN',
            isSelected: false
        },
        {
            id: 12,
            groupId: 3,
            difficulty: DiffcultyEnum.MEDIUM,
            text: '4 AVENUES',
            isSelected: false
        },
        
    ],
    completedCards: [],
    livesLeft: maxLivesLeft,
    maxWordleAttempts: maxWordleAttempts,
    attemptedConnections: [],
    isModalClosed: {
        [GameNumberEnum.WORDLE]: true,
        [GameNumberEnum.HANGMAN]: true,
        [GameNumberEnum.CONNECTIONS]: true
    }
}

export const BirthdayStore = signalStore(
    withState<BirthdayInterface>(initialState),
    withComputed((state) => {
        return {
            isHangmanSolved: computed((): boolean => {
                return !!state.hangmanAnswerShow().length && state.hangmanAnswerShow().every(ele=>ele.status===LetterStatusEnum.CORRECT_PLACE)
            }),

            selectedCards: computed((): ConnectionInterface[] => {
                return state.connections().filter(ele=>ele.isSelected)
            }),

            isConnectionsSolved: computed(() => {
                return state.connections().length==0
            })
        }        
    }),
    withMethods((store) => {

        const formBuilder = inject(FormBuilder)
        const {
            getLetterStatus,
            getRelationText,

        } = BirthdayHelpers

        return {

            initializeWordleForm: () => {
                patchState(store, {
                    wordleForm: formBuilder.group({
                        word: [{value:'',disabled: store.isWordleSolved()||store.wordleGuesses().length>=store.maxWordleAttempts()},[Validators.required, Validators.minLength(5), Validators.maxLength(5)]]
                    })
                })
            },

            initializeHangmanForm: () => {
                patchState(store, {
                    hangmanForm: formBuilder.group({
                        character: [{value: '', disabled: store.isHangmanSolved() || store.hangmanStep()==maxHangmanAttempts},[Validators.required,Validators.minLength(1),Validators.maxLength(1)]]
                    })
                })
            },

            initializeConnectionsForm: () => {
                const inputs: FormControl[] = []
                for(let i = 0; i < 4; i++){
                    inputs.push(formBuilder.control('',Validators.required))                  
                }
                patchState(store,{
                    connectionsForm: formBuilder.group({
                        "inputs": formBuilder.array(inputs)
                    })
                })
            },

            setRowNumber: (rowNumber: number) => {
                patchState(store, {
                    rowNumber
                })
            },

            setIsModalClosed: (num: GameNumberEnum,isModalClosed: boolean) => {
                patchState(store,{isModalClosed: {...store.isModalClosed(),[num]: isModalClosed}})                
            },

            initializeHangmanLetters: () => {
                patchState(store,{
                    hangmanAnswerShow: hangmanAnswer.split('').map(ele=>({character: ele, status: LetterStatusEnum.WRONG_PLACE}))
                })
            },
 
            changeHangmanLetter: (character: string) => {
                let isLetterInWord = false
                let hangmanArray =  store.hangmanAnswerShow().map(ele=>{
                    if(ele.character==character.toUpperCase()){
                        isLetterInWord = true
                        return ({
                            ...ele,
                            status: LetterStatusEnum.CORRECT_PLACE
                        })
                    }
                    return ele
                })
                if(isLetterInWord){
                    patchState(store,{hangmanAnswerShow: hangmanArray})
                }
                else{
                    patchState(store,{hangmanStep: store.hangmanStep()+1})
                }
                patchState(store,{hangmanGuesses: [...store.hangmanGuesses(),character]})

            },

            setCompletionStatus: (num: GameNumberEnum) => {
                let updatedGames = [...store.games()];
                for(let i = 0; i < store.games().length; i++){
                    if(store.games()[i].number <= num){
                        updatedGames[i] = {
                            ...updatedGames[i],
                            status: GameStatusEnum.COMPLETED
                        }
                    }
                    else{
                        updatedGames[i] = {
                            ...updatedGames[i],
                            status: GameStatusEnum.UNLOCKED
                        }
                        break;
                    }
                }

                patchState(store,{
                    games: updatedGames
                })

            },

            addWordleGuess: (word: string) => {
                const previousGuesses: LetterInterface[][] = store.wordleGuesses() || [];
                const letters: LetterInterface[] = getLetterStatus(word, store)                
                
                
                patchState(store,{
                    wordleGuesses: [...previousGuesses,letters]
                })
            },

            resetGames: () => {
                patchState(store,{
                    games: store.games().map((ele,i)=>i==0?({...ele,status:GameStatusEnum.UNLOCKED}):({...ele,status:GameStatusEnum.LOCKED}))
                })
            },

            shuffleConnections: () => {
                const copy = structuredClone(store.connections()); 
                for (let i = copy.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [copy[i], copy[j]] = [copy[j], copy[i]];
                }

                patchState(store,{connections: copy})
            },

            toggleConnectionCard: (index: number) => {
                if(store.selectedCards().length == maxSelectedCards && !store.connections()[index].isSelected) return
                const connections = store.connections().map((ele,i)=>i==index?({...ele,isSelected: !store.connections()[i].isSelected}):ele)
                patchState(store,{connections})                
            },

            resetConnections: () => {
                const connections = store.connections().map(ele=>({...ele,isSelected: false}))
                patchState(store,{connections})
            },

            checkSelectedCards: () => {
                if(store.selectedCards().length!=maxSelectedCards) return
                const selectedIds: string = store.selectedCards().map(ele=>ele.id).sort((a,b)=>a-b).join(',')
                if(store.attemptedConnections().includes(selectedIds)) return
                const areCardsRight: boolean = store.selectedCards().every(ele=>ele.groupId == store.selectedCards()[0].groupId) 

                if(store.livesLeft() && !areCardsRight){
                    
                    patchState(store,{
                        livesLeft: store.livesLeft()-1,
                        attemptedConnections: [...store.attemptedConnections(),selectedIds]
                    })
                }
                
                if(areCardsRight || !store.livesLeft()){
                    
                    let connections: ConnectionInterface[] = structuredClone(store.connections())
                    let completedCards: CompletedCardsInterface[] = structuredClone(store.completedCards())
                    let selectedCards: ConnectionInterface[] = []

                    
                    do{
                        const groupId = store.livesLeft()?store.selectedCards()[0].groupId:connections[0].groupId
                        selectedCards = store.livesLeft()?store.selectedCards():connections.filter(ele=>ele.groupId==groupId)
                        const relationText = getRelationText(groupId)
    
                        connections = connections.filter(ele=>ele.groupId!=groupId)
                        connections.map(ele=>({...ele,isSelected: false}))

                        completedCards.push({
                            difficulty: selectedCards[0].difficulty,
                            relationText,
                            guesses: selectedCards.sort((a,b)=>a.id-b.id).map(ele=>ele.text)
                        })
    
                    }
                    while(!store.livesLeft() && connections.length>0)
                    patchState(store,{connections,completedCards})

                }
            },
            
        }
    }),
    withHooks({
        onInit: (store) => {
            store.initializeWordleForm()
            store.initializeHangmanForm()
            store.initializeConnectionsForm()
            store.shuffleConnections()
        }
    })
)