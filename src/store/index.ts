import { ref } from "vue";

export const sessionId = ref(
  window.localStorage.getItem("auth-session-id") || "xd"
);
