import { Country } from "world-countries";

declare const _exports: {
    find: (by: string, value: string | number, exact?: boolean) => null | Country | Country[];
    findByArea: (area: number) => null | Country | Country[];
    findByAltSpelling: (altSpelling: string, exact?: boolean) => null | Country | Country[];
    findByBorders: (borders: string) => null | Country | Country[];
    findByCapital: (capital: string) => null | Country | Country[];
    findByCca2: (cca2: string) => null | Country | Country[];
    findByCca3: (cca3: string) => null | Country | Country[];
    findByCioc: (cioc: string) => null | Country | Country[];
    findByCcn3: (ccn3: string) => null | Country | Country[];
    findByCurrency: (currency: string) => null | Country | Country[];
    findByDemonym: (demonym: string) => null | Country | Country[];
    findByIdd: (idd: string) => null | Country | Country[];
    findByLandlocked: (landlocked: boolean) => null | Country | Country[];
    findByLanguage: (language: string) => null | Country | Country[];
    findByNameCommon: (name: string, exact?: boolean) => null | Country | Country[];
    findByNameNative: (name: string, exact?: boolean) => null | Country | Country[];
    findByNameOfficial: (name: string, exact?: boolean) => null | Country | Country[];
    findByRegion: (region: string) => null | Country | Country[];
    findBySubregion: (subregion: string) => null | Country | Country[];
    findByTld: (tld: string) => null | Country | Country[];
    findByTranslation: (translation: string, exact?: boolean) => null | Country | Country[];
};
export = _exports;
