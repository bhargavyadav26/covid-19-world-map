import React from 'react';
import Home from '../components/layout/Home';
import Axios from 'axios';
import Layout from '../components/layout/Layout';

export default class HomePage extends React.Component {
  render() {
  return (
    <Layout>
      <Home />
    </Layout>
  )
  }
}
