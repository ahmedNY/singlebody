import React from "react"
import { Router, hashHistory, Route, IndexRoute } from "react-router";
import Layout from './Layout.js';

import LoginPage from './pages/LoginPage.js';
import RestrictedPage from './pages/RestrictedPage.js';

import CasesPage from './pages/CasesPage.js';
import CaseViewPage from './pages/CaseViewPage.js';
import CaseEditorPage from './pages/CaseEditorPage.js';

import DonationsListPage from './pages/DonationsListPage.js';
import DonationsAddPage from './pages/DonationsAddPage.js';
import DonationsEditPage from './pages/DonationsEditPage.js';

import GroupsAddPage from "./pages/GroupsAddPage";
import GroupsEditPage from "./pages/GroupsEditPage";
import GroupsListPage from "./pages/GroupsListPage";

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
        <Route path="cases/addcase" component={CaseEditorPage} onEnter={requireAuth} authorize={['groupAdmin']} />
        <Route path="cases/edit/:caseId" component={CaseEditorPage} onEnter={requireAuth} authorize={['groupAdmin']} />
        <Route path="cases/:caseId" component={CaseViewPage}/>

        {/* Donations */}
        <Route path="donations" onEnter={requireAuth} authorize={['registered']}>
          <IndexRoute component={DonationsListPage}/>
          <Route path="add/:caseId" component={DonationsAddPage} />
          <Route path="edit/:donationId" component={DonationsEditPage} />
        </Route>

        {/* Groups */}
        <Route path="groups/add" component={GroupsAddPage} authorize={['admin']} onEnter={requireAuth} />
        <Route path="groups/edit/:groupId" component={GroupsEditPage} authorize={['admin', 'groupAdmin']} onEnter={requireAuth} />
        <Route path="groups" component={GroupsListPage} authorize={['admin']} onEnter={requireAuth} />

        {/* Authentication */}
        <Route path="login" component={LoginPage}/>
        <Route path="restricted" component={RestrictedPage}/>
      </Route>
    </Router>
  );


export default router;
