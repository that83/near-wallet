import {
    createEntityAdapter,
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit';

import { getTransactions, transactionExtraInfo } from '../../../utils/explorer-api';
import handleAsyncThunkStatus from '../../reducerStatus/handleAsyncThunkStatus';
import initialStatusState from '../../reducerStatus/initialState/initialStatusState';
import { basicPath, byAccountIdInitialState, customAdapterByIdSelector, customAdapterSelectors, handleByAccountId, sliceByAccountIdSelectors } from '../../byAccountIdAdapter/byAccountIdAdapter';
import handleAsyncThunkStatus from '../handleAsyncThunkStatus';

const SLICE_NAME = 'transactions';

const initialState = {
    ...byAccountIdInitialState
};
    
const transactionsAdapter = createEntityAdapter({
    selectId: ({ hash_with_index }) => hash_with_index,
    sortComparer: (a, b) => b.block_timestamp - a.block_timestamp,
});

const initialAccountIdState = {
    ...initialStatusState,
    items: transactionsAdapter.getInitialState()
};

export const fetchTransactions = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactions`,
    async ({ accountId }, { dispatch, getState }) => {
        const transactions = await getTransactions({ accountId });

        const { actions: { setTransactions, updateTransactions } } = transactionsSlice;

        selectTransactionsByAccountIdTotal(getState(), { accountId })
            ? dispatch(updateTransactions({ transactions, accountId }))
            : dispatch(setTransactions({ transactions, accountId }));
    }
);

export const fetchTransactionStatus = createAsyncThunk(
    `${SLICE_NAME}/fetchTransactionStatus`,
    async ({ hash, signer_id, accountId, hash_with_index }, { dispatch, getState }) => {
        let status;
        try {
            const transactionDetails = await transactionExtraInfo({ hash, signer_id });
            status = Object.keys(transactionDetails.status)[0];
        } catch (error) {
            status = 'notAvailable';
        }
        const checkStatus = ['SuccessValue', 'Failure'].includes(status);
        const { actions: { updateTransactionStatus } } = transactionsSlice;
        dispatch(updateTransactionStatus({ status, checkStatus, accountId, hash, hash_with_index }));
    }
);

const transactionsSlice = createSlice({
    name: SLICE_NAME,
    initialState,
    reducers: {
        setTransactions(state, action) {
            const { transactions, accountId } = action.payload;

            transactionsAdapter.setAll(basicPath(state, accountId).items, transactions);
        },
        updateTransactions(state, action) {
            const { transactions, accountId } = action.payload;

            transactionsAdapter.upsertMany(basicPath(state, accountId).items, transactions);
        },
        updateTransactionStatus(state, { payload }) {
            const { status, checkStatus, accountId, hash_with_index } = payload;
            transactionsAdapter.updateOne(basicPath(state, accountId).items, { id: hash_with_index, changes: { status, checkStatus } });
        },
    },
    extraReducers: ((builder) => {
        handleByAccountId({
            asyncThunk: fetchTransactions,
            initialState: initialAccountIdState,
            builder
        });
        handleAsyncThunkStatus({
            asyncThunk: fetchTransactions,
            buildStatusPath: ({ meta: { arg: { accountId }}}) => ['byAccountId', 'entities', accountId],
            builder
        });
    })
});


export default transactionsSlice;

export const actions = {
    fetchTransactions,
    fetchTransactionStatus,
    ...transactionsSlice.actions
};

export const {
    selectAll: selectTransactionsByAccountId,
    selectTotal: selectTransactionsByAccountIdTotal
} = customAdapterSelectors(transactionsAdapter, SLICE_NAME);

export const selectTransactionsOneByIdentity = customAdapterByIdSelector(transactionsAdapter, SLICE_NAME);

export const selectTransactionsLoading = (state, { accountId }) => sliceByAccountIdSelectors(SLICE_NAME, state, accountId)?.status?.loading;
