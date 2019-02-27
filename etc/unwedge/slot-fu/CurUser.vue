/* This template declares a default slot. 
   - It has fallback content that comes from the local `zz` object.
   - It also binds local data that's thereby accessible to the 
     slot content in the parent:
       - Local object `zz` is exposed as `zelda`
       - Local object `fz` is exposed as `fred`
*/
<template>
  <span>
    <slot v-bind:zelda="zz" v-bind:fred="fz">{{ zz.lastName }}</slot>
  </span>
</template>

<script>
export default {
  name: "CurUser",
  data() {
    return {
      zz: {
        firstName: "ZELDA",
        lastName: "ZIFFLE"
      },
      fz: {
        firstName: "fred",
        lastName: "ziffle"
      }
    };
  }
};
</script>
