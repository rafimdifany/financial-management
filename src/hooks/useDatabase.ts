import { useState, useEffect } from "react";
import { getDatabase } from "../database/database";

export function useDatabase() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function init() {
      try {
        await getDatabase();
        setIsReady(true);
      } catch (e) {
        console.error("Failed to initialize database:", e);
        setError(e as Error);
      }
    }

    init();
  }, []);

  return { isReady, error };
}
