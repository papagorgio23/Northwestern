// The following examples are documented at
// https://angularfirebase.com/lessons/rxjs-quickstart-with-20-examples/


   
// Create Observables - Define the stream
const observable = Rx.Observable.create( observer => {
    observer.next( 'hello' )
    observer.next( 'world' )
})

observable.subscribe(val => console.log(val));

// Observable from DOM Events

const clicks = Rx.Observable.fromEvent(document, 'click')

clicks.subscribe(click => console.log(click))
// click around the web page...
// MouseEvent<data>


////////////////////////////////////////////////////////////////////////////

// Observable from Promise
const promise = new Promise((resolve, reject) => { 
    setTimeout(() => {
        resolve('resolved!')
    }, 1000)
});



const obsvPromise = Rx.Observable.fromPromise(promise)

obsvPromise.subscribe(result => console.log(result) ) 

// wail 1 second...
// resolved!




////////////////////////////////////////////////////////////////////////////////

// Observable of Static Values

const mashup = Rx.Observable.of('anything', ['you', 'want'], 23, true, {cool: 'stuff'})

mashup.subscribe(val => console.log( val ))
// anything
// you,want
// 23
// true
// [object Object]


////////////////////////////////////////////////////////////////////////////////

// Cold Observable Example

const cold = Rx.Observable.create( (observer) => {
    observer.next( Math.random() )
});

cold.subscribe(a => console.log(`Subscriber A: ${a}`))
cold.subscribe(b => console.log(`Subscriber B: ${b}`))


// Subscriber A: 0.2298339030
// Subscriber B: 0.9720023832


////////////////////////////////////////////////////////////////////////////////

// Hot Observable Example

const x = Math.random()

const hot = Rx.Observable.create( observer => {
  observer.next( x )
});

hot.subscribe(a => console.log(`Subscriber A: ${a}`))
hot.subscribe(b => console.log(`Subscriber B: ${b}`))
// Subscriber A: 0.312580103
// Subscriber B: 0.312580103



////////////////////////////////////////////////////////////////////////////////
// First, Last - When the order counts

const names = Rx.Observable.of('Richard', 'Erlich', 'Dinesh', 'Gilfoyle')

names
  .first()
  .subscribe( n => console.log(n) )
// Richard


names
  .last()
  .subscribe( n => console.log(n) )
// Gilfoyle


////////////////////////////////////////////////////////////////////////////////
// Debounce and Throttle - Handle Stream Overload

const mouseEvents = Rx.Observable.fromEvent(document, 'mousemove')

mouseEvents
  .throttleTime(1000)
  .subscribe()
// MouseEvent<data>
// wait 1 second...


mouseEvents
  .debounceTime(1000)
  .subscribe()
// wait 1 second...
// MouseEvent<data>



////////////////////////////////////////////////////////////////////////////////
// Scan - Keep a Running Total

const clicks_2 = Rx.Observable.fromEvent(document, 'click')

clicks_2
  .map(e => Math.random() * 100 )
  .scan((totalScore, current) => totalScore + current)
  .subscribe()

  
////////////////////////////////////////////////////////////////////////////////
// TakeUntil - Get values until you’re told not to


const interval = Rx.Observable.interval(500)
const notifier = Rx.Observable.timer(2000)


interval
  .takeUntil(notifier)
  .finally(()  => console.log('Complete!'))
  .subscribe(i => console.log(i))
// 0
// 1
// 2
// Complete!


////////////////////////////////////////////////////////////////////////////////
// TakeWhile - Get values while the conditions are right

const names_2 = Rx.Observable.of('Sharon', 'Sue', 'Sally', 'Steve')

names_2
  .takeWhile(name => name != 'Sally')
  .finally(()  => console.log('Complete! I found Sally'))
  .subscribe(i => console.log(i))
  


/////////////////////////////////////////////////////////////////////////////////
// Subject - An Observable that talks to subscribers
const subject = new Rx.Subject()

const subA = subject.subscribe( val => console.log(`Sub A: ${val}`) )
const subB = subject.subscribe( val => console.log(`Sub B: ${val}`) )

subject.next('Hello')


setTimeout(() => {
    subject.next('World')
}, 1000)

// Sub A: Hello
// Sub B: Hello
// Sub A: World
// Sub B: World
  
  
  
  

////////////////////////////////////////////////////////////////////////////////

// Observable Timer

const interval_tick = Rx.Observable.interval(1000)

interval_tick.subscribe(i => console.log( i ))
// 0
// 1
// every second for eternity...




