# Introduction to Promises

## Promise States

Always in one of three mutually exclusive states

1. _Pending_ - result not yet ready
1. _Fulﬁlled_  - result available
1. _Rejected_ - something went wrong

When everything is "done," promise is _Settled_

Once settled, promise *never* changes state.

## Creating a Promise
```js
const vow = new Promise(function (resolve, reject) {
  // Do something asynchronous
  if (/* It worked */) {
      resolve(value);
  } else { 
      reject(reason); 
  } 
});
```

* Function passed to `Promise` constructor called _executor_
* If operation works, executor sends value via `resolve`
* If an error, executor sends reason via `reject`

## Consuming a Promise
```js
vow
  .then(value => { /* fulfillment */ }) 
  .catch(error => { /* rejection */ });
```

Notiﬁed of fulﬁllment or rejection via _reactions_
* Callbacks registered with `then` and `catch`

Once settled, promise doesn’t change 

Never a race condition; if reaction registered:
* Before promise settles, notiﬁed when settlement happens 
* After promise settles, receive (cached) value immediately