import { ref } from "vue";

const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const enabled = ref(false);
let index = 0;
let bound = false;

export function useKonami() {
  if (!bound && typeof window !== "undefined") {
    window.addEventListener("keydown", (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === sequence[index]) {
        index += 1;
        if (index === sequence.length) {
          enabled.value = !enabled.value;
          index = 0;
        }
      } else {
        index = 0;
      }
    });
    bound = true;
  }

  return { enabled };
}
