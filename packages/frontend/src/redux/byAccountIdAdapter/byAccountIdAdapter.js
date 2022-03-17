import { createEntityAdapter } from "@reduxjs/toolkit";

export const byAccountIdAdapter = createEntityAdapter({
    selectId: ({ accountId }) => accountId,
});

export const byAccountIdInitialState = {
    byAccountId: byAccountIdAdapter.getInitialState()
};

export const basicPath = (state, accountId) => state.byAccountId.entities[accountId];

