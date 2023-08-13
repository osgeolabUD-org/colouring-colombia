import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {t} from'i18next';
import { useAuth } from '../auth-context';
import ConfirmationModal from '../components/confirmation-modal';
import ErrorBox from '../components/error-box';
import { SpinnerIcon } from '../components/icons';

import { CCConfig } from '../../cc-config';
let config: CCConfig = require('../../cc-config.json')

export const MyAccountPage: React.FC = () => {
    const { isLoading, user, userError, logout, generateApiKey, deleteAccount } = useAuth();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState(undefined);

    const handleLogout = useCallback((e) => {
        e.preventDefault();
        logout(setError);
    }, [logout]);

    const handleGenerateKey = useCallback(async (e) => {
        e.preventDefault();
        
        setError(undefined);
        generateApiKey(setError);
    }, [generateApiKey]);

    const handleDeleteAccount = useCallback(() => {
        setError(undefined);
        deleteAccount(setError);
    }, [deleteAccount])

    if(!user && isLoading) {
        return (
            <article>
                <section className="main-col">
                    <SpinnerIcon spin={true} /> Loading user info... 
                </section>
            </article>
        );
    }

    const issuesURL = config.githubURL + "/issues"

    return (
        <article>
            <section className="main-col">
                { !isLoading && <ErrorBox msg={userError} /> }
                {!userError && (<>
                    <h1 className="h1">{t('Welcome,')} {user.username}!</h1>
                    <p>
                        {t('Colouring ')}{config.cityName} {t('is under active development. Please')} {' '}
                        <a href="https://discuss.colouring.london/">{t('discuss suggestions for improvements')}</a> {t('and')}{' '}
                        <a href={issuesURL}> {t('report issues or problems')}</a>.
                    </p>
                    <p>
                        {t('For reference, here are the')}{' '}
                        <Link to="/privacy-policy.html">{t('privacy policy')}</Link>,{' '}
                        <Link to="/contributor-agreement.html">{t('contributor agreement')}</Link> {t('and')}{' '}
                        <Link to="/data-accuracy.html">{t('data accuracy agreement')}</Link>.
                    </p>
                    <ErrorBox msg={error} />
                    <form onSubmit={handleLogout}>
                        <div className="buttons-container">
                            <Link to="/edit/age" className="btn btn-warning">{t('Start colouring')} </Link>
                            <input className="btn btn-secondary" type="submit" value={t("Log out")}/>
                        </div>
                    </form>

                    <hr/>
                    <h2 className="h2">{t('My Details')}</h2>
                    <h3 className="h3">{t('Username')}</h3>
                    <p>{user.username}</p>
                    <h3 className="h3">{t('Email Address')}</h3>
                    <p>{user.email || '-'}</p>
                    <h3 className="h3">{t('Registered')}</h3>
                    <p>{user.registered.toString()}</p>

                    <hr/>

                    <h2 className="h2">{t('Technical details')}</h2>
                    <p>{t('Are you a software developer? If so, you might be interested in these.')}</p>
                    <h3 className="h3">API key</h3>
                    <p>{user.api_key || '-'}</p>
                    <form onSubmit={handleGenerateKey} className="form-group mb-3">
                        <input className="btn btn-warning" type="submit" value={t('Generate API key')}/>
                    </form>

                    <h3 className="h3">{t('Open Source Code')}</h3>
                    Colouring {config.cityName} {t('site code is developed at')} <a href={config.githubURL}>colouring-cities</a> {t('on Github')}

                    <hr />

                    <h2 className="h2">{t('Account actions')}</h2>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            setShowDeleteConfirm(true);
                        }}
                        className="form-group mb-3"
                    >
                        <input className="btn btn-danger" type="submit" value={t("Delete account")} />
                    </form>

                    <ConfirmationModal
                        show={showDeleteConfirm}
                        title={t("Confirm account deletion")}
                        description={t("Are you sure you want to delete your account? This cannot be undone.")}
                        confirmButtonText={t("Delete account")}
                        confirmButtonClass="btn-danger"
                        onConfirm={() => handleDeleteAccount()}
                        onCancel={() => setShowDeleteConfirm(false)}
                    />
                </>)}
            </section>
        </article>
    );
};
