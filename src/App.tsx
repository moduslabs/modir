import React, { Component } from 'react';
import { IonApp, IonSplitPane, IonPage } from '@ionic/react';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import ModiteList from './components/ModiteList';
import './App.css';
import './theme.css';

class App extends Component {
  render() {
    return (
      <IonApp>
        <IonSplitPane contentId="main">
          <IonPage id="main">
            <ModiteList />
          </IonPage>
        </IonSplitPane>
      </IonApp>
    );
  }
}

export default App;
