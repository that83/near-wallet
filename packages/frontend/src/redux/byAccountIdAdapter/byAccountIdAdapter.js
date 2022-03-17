import { createEntityAdapter } from "@reduxjs/toolkit";

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
        (action) => action.type === `${asyncThunk.typePrefix}/pending`,
        (state, { meta }) => {
            const { accountId } = meta.arg;
            
            if (basicPath(state, accountId)) {
                return;
            }

            byAccountIdAdapter.addOne(state.byAccountId, { accountId });
            byAccountIdAdapter.upsertOne(state.byAccountId, { accountId, ...initialState });
        }
    );

