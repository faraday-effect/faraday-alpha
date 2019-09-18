<template>
  <v-container>
    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>Z1</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-expansion-panels multiple>
            <v-expansion-panel>
              <v-expansion-panel-header>A1</v-expansion-panel-header>
              <v-expansion-panel-content>A1 Content</v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>A2</v-expansion-panel-header>
              <v-expansion-panel-content>A2 Content</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Z2</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-expansion-panels multiple>
            <v-expansion-panel>
              <v-expansion-panel-header>B1</v-expansion-panel-header>
              <v-expansion-panel-content>B1 Content</v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>B2</v-expansion-panel-header>
              <v-expansion-panel-content>B2 Content</v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Z3</v-expansion-panel-header>
        <v-expansion-panel-content>Z3</v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
