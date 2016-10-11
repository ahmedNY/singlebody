
import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Grid, Row, Col} from 'react-flexbox-grid';
import CaseCard from "../components/CaseCard";
import FloatingButton from "../components/FloatingButton";
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import store from "../stores/CasesStore";
import auth from "../stores/AuthStore";

@observer
export default class CasePage extends Component {
    constructor() {
        super()
    }

    componentDidMount() {
      store.getCases()
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
            <div style={{marginRight: 20, marginLeft: 20}}>
                <Row >
                    {cases}
                </Row>

                <FloatingButton
                  index={1}
                  href={"#/cases/addcase"}
                  allowedRoles={["groupAdmin"]}>
                    <ContentAddIcon/>
                </FloatingButton>

            </div>
        );
    }
}
