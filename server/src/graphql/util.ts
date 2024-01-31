import {ApolloError} from "apollo-server";

export const sendGraphqlError = (error: Error, code: string = '500') => {
    const splitError = error.message.split(/error: /i);
    const errorMessage = splitError[splitError.length-1] || 'Unknown error'
    console.log(error.message);
    throw new ApolloError(errorMessage, code)
}
