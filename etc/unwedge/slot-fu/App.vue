<template>
  <div>
    <h1>Hello!</h1>

    <!-- Render the fallback content. -->
    <p>User 1:
      <cur-user></cur-user>.
    </p>

    <!-- Fill the default slot with a literal. -->
    <p>User 2:
      <cur-user>YAMMER</cur-user>.
    </p>

    <!-- Fill the default slot with local data. -->
    <p>User 3:
      <cur-user>{{ whoAmI }}</cur-user>.
    </p>

    <!-- Define a template that binds to data available from the child. -->
    <p>User 4:
      <cur-user>
        <!-- `default` is the slot name -->
        <!-- `beta` refers to all data exposed by scoped slot -->
        <!-- `beta.zelda` is how `zz` data is exposed -->
        <!-- `beta.zelda.firstName` grabs data from inside Zelda's `zz` object. -->
        <template v-slot:default="beta">
          {{ beta.zelda.firstName }} {{ beta.zelda.lastName }}
          <span style="color: red">loves</span>
          {{ beta.fred.firstName}} {{ beta.fred.lastName }}
          </template>
      </cur-user>.
    </p>
  </div>
</template>

<script>
import CurUser from "./CurUser";

export default {
  name: "SlotFu",
  components: { CurUser },
  data() {
    return {
      whoAmI: 'Mo Bilhome'
    }
  }
};
</script>
