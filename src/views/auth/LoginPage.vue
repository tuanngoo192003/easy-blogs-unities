<script setup lang="ts">

import {ref} from "vue";
import {LoginParams} from "../../api/auth/login/type";

const form = ref<LoginParams>({
  identifier: '',
  password: ''
})


</script>

<template>
  <q-form>
    <q-input :model-value="form.identifier" />
    <q-input
        :model-value="form.password"
        type="password"
    />
  </q-form>
</template>

<style scoped>

</style>