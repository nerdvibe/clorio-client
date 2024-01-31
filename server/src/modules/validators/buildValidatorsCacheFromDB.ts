import {validatorsCacheSet} from "@modules/cache/validators";
import {db} from "../../db";

export const buildValidatorsCacheFromDB = async() => {
    const validators = await db('validators')
        .select('name', 'publicKey')

    const validatorsNameValue = validators.map((v) => ({
        name: v.name,
        publicKey: v.publicKey
    }))

    await validatorsCacheSet(validatorsNameValue);
};
