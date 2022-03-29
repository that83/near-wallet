import { createSlice } from '@reduxjs/toolkit';
import set from 'lodash.set';

import FungibleTokens from '../../../services/FungibleTokens';

const SLICE_NAME = 'tokensMetadata';

const initialState = {
    byContractName: {}
};

export async function getCachedContractMetadataOrFetch(contractName, state) {
    let contractMetadata = selectOneContractMetadata(state, { contractName });
    if (contractMetadata) {
        return contractMetadata;
    }
    return FungibleTokens.getMetadata({ contractName });
}

const tokensMetadataSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setContractMetadata(state, { payload }) {
            const { metadata, contractName } = payload;
            set(state, ['byContractName', contractName], metadata);
        }
    }
});

