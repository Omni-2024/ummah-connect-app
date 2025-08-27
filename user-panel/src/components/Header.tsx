"use client";

import { state } from "@/state/state";
import { useSnapshot } from "valtio";

export default function Header() {
  const snap = useSnapshot(state);

  return (
    <main>
      <h1>Header</h1>
      <p>Count: {snap.count}</p>
      <button onClick={() => state.count++}>Increase</button>
    </main>
  );
}
