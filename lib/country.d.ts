export interface Country {
  name:         Name;
  tld:          string[];
  cca2:         string;
  ccn3:         string;
  cca3:         string;
  cioc:         string;
  independent:  boolean;
  status:       string;
  currency:     string[];
  idd:          Idd;
  capital:      string[];
  altSpellings: string[];
  region:       string;
  subregion:    string;
  languages:    Languages;
  translations: { [key: string]: Translation };
  latlng:       number[];
  demonym:      string;
  demonyms:     Demonyms;
  landlocked:   boolean;
  borders:      string[];
  area:         number;
  flag:         string;
}

export interface Demonyms {
  fra: Fra;
  spa: Fra;
}

export interface Fra {
  f: string;
  m: string;
}

export interface Idd {
  root:     string;
  suffixes: string[];
}

export interface Languages {
  bar: string;
}

export interface Name {
  common:   string;
  official: string;
  native:   Native;
}

export interface Native {
  bar: Translation;
}

export interface Translation {
  official: string;
  common:   string;
}
