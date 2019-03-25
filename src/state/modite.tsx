import { createContext, Context } from 'react';

const ModiteContext: Context<any> = createContext([{}, Function]);
const ModiteContextProvider = ModiteContext.Provider;

export { ModiteContextProvider };
export default ModiteContext;
