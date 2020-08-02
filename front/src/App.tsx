import React from 'react';
import {BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom';

import {Connexion} from './components/connexion/Connexion'
import {Register} from './components/register/Register'
import {Landing} from './components/landing/Landing'
import {Premium} from './components/premium/Premium'
import {Subscriber} from './components/subscriber/Subscriber'
import {VIP} from './components/VIP/VIP'

import './components/style.scss'

export const App = () => {

  const [userId, setUserId] = React.useState<any>()
  const [pseudo] = React.useState<any>(localStorage.getItem('pseudo'))

  React.useEffect(() => {

    if (localStorage.getItem('reload') === "true") {
      setTimeout(() => {
        window.location.reload()
        localStorage.setItem('reload', 'false')
      }, 150)
    }
    if (localStorage.getItem('userId')) {
      setUserId(localStorage.getItem('userId'))
    }
  }, [])


  return (
    <Switch>
      {!userId || !pseudo ?
        <>
          <Route exact path="/" component={Landing} />
          <Route path="/connexion" component={Connexion} />
          <Route path="/register" component={Register} />
          <Route path="/premium" component={Premium} />
        </>
        :
        <>
          <Route exact path="/" component={Premium} />
          <Route path="/premium" component={Premium} />
          <Route path="/subscriber" component={Subscriber} />
          <Route path="/config-vip" component={VIP} />
        </>}
    </Switch>
  );
}
