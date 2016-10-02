import React from "react"
import { Router, hashHistory, Route, IndexRoute } from "react-router";
import Layout from './Layout.js';
import CasesPage from './pages/CasesPage.js';
import CaseViewPage from './pages/CaseViewPage.js';
import CaseEditorPage from './pages/CaseEditorPage.js';
import LoginPage from './pages/LoginPage.js';
import RestrictedPage from './pages/RestrictedPage.js';
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
        <Route path="cases/addcase" component={CaseEditorPage} onEnter={requireAuth} authorize={['superAdmin']} />
        <Route path="cases/edit/:caseId" component={CaseEditorPage} onEnter={requireAuth} authorize={['superAdmin']} />
        <Route path="cases/donate/:caseId" component={DonatePage} onEnter={requireAuth} authorize={['registered']} />
        <Route path="cases/:caseId" component={CaseViewPage}/>
        <Route path="login" component={LoginPage}/>
        <Route path="restricted" component={RestrictedPage}/>
      </Route>
    </Router>
  );


export default router;
