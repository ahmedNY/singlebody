import  React from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PaperComponent from '../components/PaperComponent'

import {List, ListItem} from 'material-ui/List';
import ActionCheck from 'material-ui/svg-icons/action/check-circle';
import ActionSchedule from 'material-ui/svg-icons/action/schedule';
import Divider from 'material-ui/Divider';

import { observer } from "mobx-react";
import { IntlProvider, FormattedRelative, addLocaleData } from "react-intl";
import ar from 'react-intl/locale-data/ar';
import { Row, Col } from 'react-flexbox-grid';


import store from '../stores/DonationsStore'

addLocaleData(ar);

const pTypes = {
  collector: "تسليم لاقرب مندوب متطوع",
  ePayment: "الدفع الاكتروني",
  phoneCreditTransfer: "تحويل الرصيد"
}

@observer
export default class DonationsPage extends React.Component {

  constructor(props){
    super(props);
  }

  componentDidMount () {
      // fetch data initially
    this.fetchCases()
  }

   fetchCases () {
     console.log("Fetching donations ........")
     store.getDonations();
   }

   renderList (donations) {
     let list = [];
     for(var i = 0; i < donations.length; i++){
       let d = donations[i];
       let item = <ListItem href={"#/donations/edit/" + d.id} key={"li"+i} primaryText={(d.isPromise ? "لقد وعدت بدفع " : "لقد تبرعت بـ ") + d.amount + " جنيه عن طريق  " +  pTypes[d.paymentType]}
                            secondaryText={
                                <div>
                                    <IntlProvider locale="ar">
                                        <FormattedRelative value={d.updatedAt} />
                                    </IntlProvider>
                                    <br/>
                                </div>
                                }
                            leftIcon={d.isPromise ? <ActionSchedule/> : <ActionCheck />} />
       list.push(item);
       list.push(<Divider key={"div"+i}/>);
     }
     list.pop();
     return(
       <List>
        {list}
       </List>
     );
   }

  render() {
    const donationsList = store.donatedCases.map((_case) => {
      return(
        <div key={"c"+_case.id}>
          <Card>
            <CardTitle title={_case.title} subtitle={_case.groupName} />
              {this.renderList(_case.donations)}
          </Card>
          <br/>
        </div>
      );
    });

    return(
      <PaperComponent>
        {donationsList.length > 0 ?
          <div>
            <h1>تبرعاتك</h1>
            {donationsList}
          </div>
          :
          <Row center="xs">
            <Col>
              <h1>عذراً انت لم تقم بالتبرع بعد 🤔</h1>
              <RaisedButton
              href="#/"
              label="عرض حالات تحتاج العون"
              primary={true}/>
            </Col>
          </Row>
        }
      </PaperComponent>

    );
  }
}
