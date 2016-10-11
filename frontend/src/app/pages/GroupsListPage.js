// Core
import React from "react";
import { observer } from "mobx-react";

// Ui
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
// Project
import PaperComponent from "../components/PaperComponent";
import store from "../stores/GroupsStore";
import config from "../config";
import FloatingButton from "../components/FloatingButton";
import ContentAddIcon from 'material-ui/svg-icons/content/add';

const backendUrl = config.backendUrl();

@observer
export default class GroupsAddPage extends React.Component {

  componentDidMount () {
      // fetch data initially
    this.fetchGroups()
  }

  componentWillUnmount () {
    // reset store values
    store.groups = [];
  }

   fetchGroups () {
     console.log("Fetching groups ........")
     store.getGroups();
   }

  render() {
    const groupsList = store.groups.map( (g, i) => {
      return (
        <ListItem key={i}
          href={"#/groups/edit/" + g.id}
          leftAvatar={<Avatar src={backendUrl + g.imageUrl}/>}
          primaryText={g.name}
          secondaryText={g.about}/>
      );
    })
    return (
      <div>

      <FloatingButton allowedRoles={["admin"]} index={1} href={"#/groups/add"}>
        <ContentAddIcon/>
      </FloatingButton>
      <PaperComponent>
      <h2>المجموعات</h2>
      <List>
        {groupsList}
      </List>
      </PaperComponent>
      </div>
    );
  }
}
