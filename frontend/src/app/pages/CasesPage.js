
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
            <Grid>
                <Row >
                    {cases}
                </Row>
                {auth.isLogedIn ?
                    <FloatingButton index={1} href={"#/cases/addcase"}>
                        <ContentAddIcon/>
                    </FloatingButton>
                 : null
                }
            </Grid>
        );
    }
}
