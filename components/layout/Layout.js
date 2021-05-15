import Head from 'next/head'
import React from 'react';

export default class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }
      

    render() {
        const { children } = this.props;
        return (
          <div>
            <Head>
              <title>Covid-19</title>
              <link rel="icon" href="/log.jpg" />
            </Head>
      
            <main className="container">
                <div>
            {children}
            </div>
            </main>
      
            <footer>
                Powered by
                <img src="/log.jpg" alt="Vercel Logo" className="logo" />
            </footer>
      
          </div>
        )
    }
}
