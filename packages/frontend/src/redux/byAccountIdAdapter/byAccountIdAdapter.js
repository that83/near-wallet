import { createEntityAdapter, isPending } from "@reduxjs/toolkit";

export const byAccountIdAdapter = createEntityAdapter({
    selectId: ({ accountId }) => accountId,
});

export const byAccountIdInitialState = {
    byAccountId: byAccountIdAdapter.getInitialState()
};

export const basicPath = (state, accountId) => state.byAccountId.entities[accountId];

export const handleByAccountId = ({
    asyncThunk,
    initialState,
    builder
}) => builder
    .addMatcher(
        isPending(asyncThunk),
        (state, { meta }) => {
            const { accountId } = meta.arg;
            
            if (basicPath(state, accountId)) {
                return;
            }

            byAccountIdAdapter.addOne(state.byAccountId, { accountId });
            byAccountIdAdapter.upsertOne(state.byAccountId, { accountId, ...initialState });
        }
    );

export const byAccountIdSelectors = (sliceName) => byAccountIdAdapter.getSelectors((state) => state[sliceName].byAccountId);

export const sliceByAccountIdSelectors = (sliceName, state, accountId) => byAccountIdSelectors(sliceName).selectById(state, accountId) || {};

export const customAdapterSelectors = (adapter, sliceName) => adapter.getSelectors((state, { accountId }) => sliceByAccountIdSelectors(sliceName, state, accountId)?.items || state[sliceName].byAccountId);

export const customAdapterByIdSelector = (adapter, sliceName) => (state, { accountId, id }) => adapter.getSelectors().selectById(sliceByAccountIdSelectors(sliceName, state, accountId)?.items || state[sliceName].byAccountId, id);
