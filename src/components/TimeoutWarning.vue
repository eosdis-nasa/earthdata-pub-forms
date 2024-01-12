<template>
  <b-modal ref="TimeoutWarning" title="Session Expiring" ok-title="Extend Session" cancel-title="Logout Now" size="sm"
    button-size="sm" @ok="extend" @cancel="logout" hide-header-close no-close-on-backdrop no-close-on-esc centered>
    Your session will expire in {{ count }} seconds.
  </b-modal>
</template>
<script src="../assets/js/TimeoutWarning.js"></script>
<style></style>