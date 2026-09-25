export type Mf2Value = string | boolean | number | Record<string, unknown> | Mf2Object;

export type Mf2ObjectProperties = Record<string, Mf2Value[]>;

export type Mf2Object = {
  type: string[];
  properties: Mf2ObjectProperties;
  children?: Mf2Object[] | null;
};