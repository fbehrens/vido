import { onDestroy, setContext, getContext } from "svelte";
import type { Toast } from "./types";
type TimeoutType = ReturnType<typeof setTimeout>;

export class ToastState {
  toasts = $state<Toast[]>([]);
  toastToTimeoutMap = new Map<string, TimeoutType>();
  constructor() {
    onDestroy(() => {
      for (const timeout of this.toastToTimeoutMap.values()) {
        clearTimeout(timeout);
      }
      this.toastToTimeoutMap.clear();
    });
  }
  add(title: string, message: string, durationMs = 5000) {
    const id = crypto.randomUUID();
    this.toasts.push({ id, title, message });
    this.toastToTimeoutMap.set(
      id,
      setTimeout(() => {
        this.remove(id);
      }, durationMs),
    );
  }
  remove(id: string) {
    const timeout = this.toastToTimeoutMap.get(id);
    if (timeout) {
      clearTimeout(timeout);
    }
    this.toastToTimeoutMap.delete(id);
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}

const TOAST_KEY = Symbol("TOAST_KEY");

export function setToastState() {
  return setContext(TOAST_KEY, new ToastState());
}

export function getToastState() {
  return getContext<ReturnType<typeof setToastState>>(TOAST_KEY);
}
