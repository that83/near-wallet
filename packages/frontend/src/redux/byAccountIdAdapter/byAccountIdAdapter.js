import { createEntityAdapter } from "@reduxjs/toolkit";

export const byAccountIdAdapter = createEntityAdapter({
    selectId: ({ accountId }) => accountId,
});

