import { Types } from "mongoose";
import { Country, ICountry } from "../models/country";

export type COUNTRY_CREATION_DETAILS = Pick<
    ICountry,
    "countryName" | "countryAbbreviation" | "countryCode"
>;

export type CountryId = string | Types.ObjectId;

export const createCountry = async (countryData: COUNTRY_CREATION_DETAILS): Promise<ICountry | null> => {
    try {
        const country = new Country(countryData);
        return await country.save();
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const updateCountry = async (countryId: CountryId, countryData: COUNTRY_CREATION_DETAILS): Promise<ICountry | null> => {
    try {
        return await Country.findOneAndUpdate({ _id: countryId }, { ...countryData });
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const getCountry = async (countryId: CountryId): Promise<ICountry | null> => {
    try {
        return await Country.findOne({ _id: countryId });
    } catch (error) {
        throw new Error((error as Error).message);
    }
};

export const getCountries = async (): Promise<Array<ICountry> | null> => {
    try {
        return await Country.find({ deleted: false }).sort([["countryName", "asc"]]);
    } catch (error) {
        throw new Error((error as Error).message);
    }
}

