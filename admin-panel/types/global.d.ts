interface Window {
  showOpenFilePicker?: (options?: {
    multiple?: boolean;
    types?: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<{ getFile: () => Promise<File> }[]>;
}

type ReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends (infer U)[]
    ? ReadonlyArray<ReadonlyDeep<U>>
    : T[K] extends object
      ? ReadonlyDeep<T[K]>
      : T[K];
};
