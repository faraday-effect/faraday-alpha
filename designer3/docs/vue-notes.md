# Vue Notes

## Scoped Slots

Several variants of using scoped slots to pop open a menu
with a button.

Note the 
[slot props exposed by `v-menu`](https://vuetifyjs.com/en/components/menus#api)
include `on`, which is an object containing event handlers.
From the developer console:
```ts
on: {click: f, keydown: f}
```

The most verbose reaches into the underlying props, extracts
`on` and binds the `click` handler to `@click`.

```vue
<v-menu offset-y>
  <template v-slot:activator="slotProps">
    <v-btn color="primary" @click="slotProps.on.click">
      From Scratch
    </v-btn>
  </template>
  <v-list>
    // ...
  </v-list>
</v-menu>
```

Using object destructuring, we can get to the
`on` object directly, and then bind the `click` 
handler to `@click`.

```vue
<template v-slot:activator="{ on }">
  <v-btn color="primary" @click="on.click">
    From Scratch
  </v-btn>
</template>
```

The idiomatic version used in Vuetify documentation
is even shorter.
We are still destructuring the slot props,
but now using an abbreviated version 
of the event binding.
Per the [Vue documentation](https://vuejs.org/v2/api/#v-on):

> `v-on` also supports binding to an object of event/listener pairs without an argument

as illustrated by this example:

```vue
<button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
```

Recalling the binding for `on`
```ts
on: {click: f, keydown: f}
```
A `click` event on the `v-btn`
invokes the `on.click` function.

```vue
<template v-slot:activator="{ on }">
  <v-btn color="primary" dark v-on="on">
    Drop down
  </v-btn>
</template>
```