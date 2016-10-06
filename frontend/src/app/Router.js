import React from "react"
import { Router, hashHistory, Route, IndexRoute } from "react-router";
import Layout from './Layout.js';

import LoginPage from './pages/LoginPage.js';
import RestrictedPage from './pages/RestrictedPage.js';

import CasesPage from './pages/CasesPage.js';
import CaseViewPage from './pages/CaseViewPage.js';
import CaseEditorPage from './pages/CaseEditorPage.js';

import DonationsPage from './pages/DonationsPage.js';
import DonatePage from './pages/DonatePage.js';

import auth from './stores/AuthStore';

let requireAuth = (nextState, replace) => {
  if(!auth.isLogedIn) {
    replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname }
        })
  }
}

let router = () => (
    <Router history={hashHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={CasesPage}/>
        {/* Cases */}
        <Route path="cases/addcase" component={CaseEditorPage} onEnter={requireAuth} authorize={['admin']} />
        <Route path="cases/edit/:caseId" component={CaseEditorPage} onEnter={requireAuth} authorize={['admin']} />
        <Route path="cases/:caseId" component={CaseViewPage}/>
        {/* Donations */}
        <Route path="donations" onEnter={requireAuth} authorize={['registered']}>
          <IndexRoute component={DonationsPage}/>
          <Route path="add/:caseId" component={DonatePage} />
        </Route>

        {/* Authentication */}
        <Route path="login" component={LoginPage}/>
        <Route path="restricted" component={RestrictedPage}/>
      </Route>
    </Router>
  );


export default router;
