import React from 'react';
import { Translate } from 'react-localize-redux';

import { Mixpanel } from '../../../../mixpanel/index';
import FormButton from '../../../common/FormButton';
import LocalAlertBox from '../../../common/LocalAlertBox';
import LedgerImageCircle from '../../../svg/LedgerImageCircle';
import LedgerHdPaths from '../LedgerHdPaths';

const Authorize = ({
    status,
    path,
    setPath,
    setConfirmedPath,
    handleSignIn,
    signingIn,
    handleCancel
}) => {
    return (
        <>
            <LedgerImageCircle />
            <h1><Translate id='signInLedger.header' /></h1>
            <Translate id='signInLedger.one' />
            <br /><br />
            <LocalAlertBox localAlert={status.localAlert} />
            <LedgerHdPaths
                path={path}
                onSetPath={(path) => setPath(path)}
                onConfirmHdPath={() => {
                    setConfirmedPath(path);
                    Mixpanel.track('IE-Ledger Sign in set custom HD path');
                }}
            />
            <div className='buttons-bottom-buttons'>
                <FormButton
                    onClick={handleSignIn}
                    sending={signingIn}
                    sendingString='button.signingIn'
                >
                    <Translate id='button.authorize' />
                </FormButton>
                <FormButton
                    className='gray link'
                    onClick={handleCancel}
                    trackingId='IE-Ledger Click cancel button'
                >
                    <Translate id='button.cancel' />
                </FormButton>
            </div>
        </>
    );
};

export default Authorize;
