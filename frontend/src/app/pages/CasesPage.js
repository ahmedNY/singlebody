
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
export default class CasePage extends Component {
    constructor() {
        super()
    }

    componentDidMount() {
      // store.getCases()
    }
   
    _loadMoreItems = () => {
        console.log("Loading more cases ...");
        store.getMoreCases();
    }

    _renderWaypoint = () => {
        if(store.noMoreCases) return;
      if (!store.isLoadingMore) {
        return (
          <Waypoint
            onEnter={this._loadMoreItems}
            threshold={2.0}
          />
        );
      }
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
                {this._renderWaypoint()}

                <AuthorizedComponent allowedRoles={["groupAdmin"]}>
                  <FloatingButton index={1} href={"#/cases/addcase"}>
                    <ContentAddIcon/>
                  </FloatingButton>
                </AuthorizedComponent>

            </div>
        );
    }
}
