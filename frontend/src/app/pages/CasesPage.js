
import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Grid, Row, Col} from 'react-flexbox-grid';
import CaseCard from "../components/CaseCard";
import FloatingButton from "../components/FloatingButton";
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import store from "../stores/CasesStore";
import uiStore from "../stores/UiStore";
import auth from "../stores/AuthStore";
import AuthorizedComponent from "../components/AuthorizedComponent";
import Waypoint from 'react-waypoint';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const style = {
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

@observer
export default class CasesPage extends Component {
    constructor() {
        super();
        this.state = {showInfinteLoader: false}
    }

    componentDidMount() {
      store.getCases().then(() => {
        this._renderWaypoint();
      })
      uiStore.showSearchIcon = true;
    }

    componentWillUnmount() {
      uiStore.showSearchIcon = false;
      store.reset();
    }
   
    _loadMoreItems = () => {
        console.log("Loading more cases ...");
        store.getMoreCases();
    }

    _renderWaypoint = () => {
      setTimeout(() => {
        if (!store.isLoadingMore && !store.noMoreCases) {
          this.setState({showInfinteLoader: true})
          console.log("rendering Waypoint ......")
          clearTimeout() 
        }
      }, 3000);
    }

    render() {
        const cases = store.cases.map( caseModel => {
            return (
                <Col key={caseModel.id} xs={12} sm={6} md={4} >
                    <CaseCard caseModel={caseModel}/>
                </Col>
            );
        });

        return(
            <div style={{marginRight: 20, marginLeft: 20, marginBottom: 20}}>
                <Row >
                    {cases}
                </Row>
                {store.isLoadingMore ? 
                    <Row around="xs">
                        <Col>
                            <RefreshIndicator
                              size={50}
                              left={0}
                              top={10}
                              loadingColor="#FF9800"
                              status="loading"
                              style={style.refresh}
                            />
                        </Col>
                    </Row>
                : null }
                {this.state.showInfinteLoader ? (
                  <Waypoint
                    onEnter={this._loadMoreItems}
                    threshold={2.0}
                  />
                ) : null}

                <AuthorizedComponent allowedRoles={["groupAdmin"]}>
                  <FloatingButton index={1} href={"#/cases/addcase"}>
                    <ContentAddIcon/>
                  </FloatingButton>
                </AuthorizedComponent>

            </div>
        );
    }
}
