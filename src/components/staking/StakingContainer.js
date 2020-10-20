import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStaking, switchAccount, stake, unstake, withdraw } from '../../actions/staking'
import styled from 'styled-components'
import Container from '../common/styled/Container.css'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Staking from './components/Staking'
import Validators from './components/Validators'
import Validator from './components/Validator'
import StakingAction from './components/StakingAction'


const StyledContainer = styled(Container)`

    line-height: normal;

    button {
        display: block !important;
        margin: 35px auto 45px auto !important;
        width: 100% !important;

        &.seafoam-blue {
            &:hover {
                border-color: #6ad1e3 !important;
                background: #6ad1e3 !important;
            }
        }
    }

    .desc {
        text-align: center;
        line-height: 150% !important;
        margin: 25px 0;
    }

    input {
        margin: 0 !important;

        &.view-validator {
            margin-bottom: 25px !important;
        }
    }
    
    .input-validation-label {
        margin-top: -14px !important;
    }

    h3 {
        border-bottom: 2px solid #E6E6E6;
        margin-top: 35px;
        padding-bottom: 15px;
    }

    h4 {
        margin: 30px 0 15px 0;
    }

    .arrow-circle {
        display: block;
        margin: 50px auto 20px auto;
    }

    .no-border {
        border-top: 2px solid #F8F8F8;
        padding-top: 15px;
        margin-top: 15px;
    }

    .transfer-money-icon {
        display block;
        margin: 50px auto;
    }

    .withdrawal-disclaimer {
        font-style: italic;
        line-height: 140%;
        margin-top: 20px;
        max-width: 375px;
        font-size: 13px;
    }

    .balance-banner {
        margin-bottom: 40px;
    }

    .alert-banner {
        margin: -35px -15px 50px -15px;
        border-radius: 0;
        @media (min-width: 495px) {
            margin: 0 0 50px 0;
            border-radius: 4px;
        }
    }

    .amount-header-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 30px 0 15px 0;

        h4 {
            margin: 0;
        }

        button {
            margin: 0 !important;
            width: auto !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            text-transform: capitalize !important;
        }
    }
`

export function StakingContainer({ history }) {
    const dispatch = useDispatch()
    const { actionsPending, balance } = useSelector(({ account }) => account);
    const { hasLedger } = useSelector(({ ledger }) => ledger)
    
    // staking state
    let staking = useSelector(({ staking }) => staking)
    // list of all active validators
    let validators = staking.allValidators
    // current view of staking
    staking = staking[staking.accountId]
    // current validators for selected account
    const currentValidators = staking.validators

    const { useLockup, totalUnstaked, selectedValidator } = staking
    const availableBalance = useLockup ? totalUnstaked : balance.available
    const loading = actionsPending.some(action => ['STAKE', 'UNSTAKE', 'WITHDRAW', 'UPDATE_STAKING'].includes(action))

    // on mount update all accounts
    useEffect(() => {
        dispatch(updateStaking(useLockup))
    }, [])

    const handleSwitchAccount = async (accountId) => {
        await dispatch(switchAccount(accountId))
    }
    // DEBUG
    window.handleSwitchAccount = handleSwitchAccount

    
    const handleStakingAction = async (action, validator, amount) => {
        if (action === 'stake') {
            await dispatch(stake(useLockup, validator, amount))
        } else if (action === 'unstake') {
            await dispatch(unstake(useLockup, selectedValidator || validator, amount))
        }
        await dispatch(updateStaking(useLockup))
    }

    const handleWithDraw = async () => {
        await dispatch(withdraw(useLockup, selectedValidator))
        await dispatch(updateStaking(useLockup))
    }

    return (
        <StyledContainer className='small-centered'>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route
                        exact
                        path='/staking'
                        render={() => (
                            <Staking
                                {...staking} 
                                currentValidators={currentValidators}
                                selectedValidator={selectedValidator}
                                availableBalance={availableBalance}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/validators'
                        render={(props) => (
                            <Validators
                                {...props}
                                validators={validators}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator'
                        render={(props) => (
                            <Validator 
                                {...props} 
                                validators={validators}
                                onWithdraw={handleWithDraw}
                                loading={loading}
                                selectedValidator={selectedValidator}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator/stake'
                        render={(props) => (
                            <StakingAction
                                {...props}
                                action='stake'
                                handleStakingAction={handleStakingAction}
                                availableBalance={availableBalance} 
                                validators={validators}
                                loading={loading}
                                hasLedger={hasLedger}
                            />
                        )}
                    />
                    <Route
                        exact
                        path='/staking/:validator/unstake'
                        render={(props) => (
                            <StakingAction
                                {...props}
                                action='unstake'
                                handleStakingAction={handleStakingAction}
                                availableBalance={availableBalance}
                                validators={validators}
                                loading={loading}
                                hasLedger={hasLedger}
                            />
                        )}
                    />
                </Switch>
            </ConnectedRouter>
        </StyledContainer>
    )
}